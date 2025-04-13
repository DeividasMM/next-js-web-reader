## Working with Turso

# Install client

macOS:
brew install tursodatabase/tap/turso

Windows:
curl -sSfL https://get.tur.so/install.sh | bash

# Login and logout

turso auth login || turso auth logout

# Opening Turso SQL shell

turso db shell freelancers
