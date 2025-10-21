{
  description = "GitHub action for installing lux-cli and lux-lua";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    git-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ self, nixpkgs, ... }:
    let
      lib =
        with nixpkgs.lib;
        nixpkgs.lib
        // {
          foreach =
            xs: f:
            foldr recursiveUpdate { } (
              if isList xs then
                map f xs
              else if isAttrs xs then
                mapAttrsToList f xs
              else
                throw "foreach: expected list or attrset but got ${typeOf xs}"
            );
          findModulesList =
            dir:
            pipe dir [
              builtins.readDir
              (filterAttrs (name: type: type == "directory" || hasSuffix ".nix" name && name != "default.nix"))
              attrNames
              (map (f: "${dir}/${f}"))
            ];
        };
    in
    {
      inherit lib;
    }
    // lib.foreach lib.systems.flakeExposed (
      system:
      let
        pkgs = inputs.nixpkgs.legacyPackages.${system};
        git-hooks-check = inputs.git-hooks.lib.${system}.run {
          src = self;
          hooks = {
            nixfmt.enable = true;
          };
        };
      in
      {
        checks.${system} = rec {
          default = git-hooks-check;
          inherit
            git-hooks-check
            ;
        };
        devShells.${system}.default = pkgs.mkShell {
          inherit (git-hooks-check) shellHook;
          buildInputs =
            with pkgs;
            [
              typescript-language-server
              nodejs
              pnpm
              # nodePackages.*
            ]
            ++ self.checks.${system}.git-hooks-check.enabledPackages;
        };

        formatter.${system} =
          let
            config = self.checks.${system}.git-hooks-check.config;
            inherit (config) package configFile;
            script = ''
              ${pkgs.lib.getExe package} run --all-files --config ${configFile}
            '';
          in
          pkgs.writeShellScriptBin "pre-commit-run" script;
      }
    );
}
