{
  description = "Python 3.12.9 with uv and Docker from nixpkgs 25.05";

  inputs = {
    # Основной nixpkgs 25.05
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        # Основные пакеты из nixpkgs 25.05
        pkgs = nixpkgs.legacyPackages.${system};

        # Python environment
       python = pkgs.python312.overrideAttrs (oldAttrs: {
          version = "3.12.9";
          src = pkgs.fetchurl {
            url = "https://www.python.org/ftp/python/3.12.9/Python-3.12.9.tar.xz";
            sha256 = "04hiz3rji39b613zjx4666jaq2jqykgshhlqdq07rcwhkxfq683j";
          };
          # при необходимости добавьте патчи или зависимости
        });
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            # Python 3.12.9 из конкретного коммита
            python

            # uv из стабильной ветки 25.05
            pkgs.uv

            # Docker и Docker Compose
            pkgs.docker
            pkgs.docker-compose

            # Дополнительные инструменты
            pkgs.git
          ];

          shellHook = ''
            echo "Development environment with Python 3.12.9, uv, and Docker"
            echo "Python version: $(python --version)"
            echo "uv version: $(uv --version)"
            echo "Docker version: $(docker --version 2>/dev/null || echo 'Docker daemon not running')"
            echo "Docker Compose version: $(docker-compose --version)"

            # Настраиваем uv для использования конкретного Python
            export UV_PYTHON=${python}/bin/python
            export UV_PYTHON_PREFERENCE="only-system"

            # Создаем .venv если его нет
            if [ ! -d ".venv" ]; then
              echo "Creating virtual environment..."
              uv venv .venv
            fi

            # Проверяем доступность Docker
            if ! docker info >/dev/null 2>&1; then
              echo ""
              echo "⚠️  Docker daemon is not running. To start Docker:"
              echo "   sudo systemctl start docker"
              echo "   # или добавьте себя в группу docker:"
              echo "   sudo usermod -aG docker $USER"
              echo "   # затем перелогиньтесь"
            fi

            echo ""
            echo "Ready to work! Commands available:"
            echo "  Python & uv:"
            echo "    uv init <project-name>     - Create new project"
            echo "    uv add <package>           - Add dependency"
            echo "    uv remove <package>        - Remove dependency"  
            echo "    uv sync                    - Sync dependencies"
            echo "    uv run <command>           - Run command in project env"
            echo "    source .venv/bin/activate  - Activate venv manually"
            echo ""
            echo "  Docker:"
            echo "    docker-compose up          - Start services"
            echo "    docker-compose up -d       - Start services in background"
            echo "    docker-compose down        - Stop services"
            echo "    docker-compose logs        - View logs"
            echo "    docker ps                  - List running containers"
          '';
        };
      }
    );
}
