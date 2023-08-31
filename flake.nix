{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixpkgs-unstable";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
    };

    devenv = {
      # https://github.com/cachix/devenv/issues/756
      url = "github:cachix/devenv/6a30b674fb5a54eff8c422cc7840257227e0ead2";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    devenv,
    ...
  } @ inputs:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      corepackEnable = pkgs.runCommand "corepack-enable" {} ''
        mkdir -p $out/bin
        ${pkgs.nodejs}/bin/corepack enable --install-directory $out/bin
      '';
    in {
      formatter = pkgs.alejandra;

      devShells.default = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          ({pkgs, ...}: {
            packages = with pkgs; [
              mysql
              nodejs
              corepackEnable
            ];

            services = {
              mysql = {
                enable = true;
                package = pkgs.mysql;
              };
            };
          })
        ];
      };
    });
}
