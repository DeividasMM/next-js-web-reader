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

# Run the style using SCSS

To start SCSS compile to regular CSS just run this command in your command line or IDE terminal.

"sass --watch src/app/styles/main.scss:src/app/styles/global.css"
