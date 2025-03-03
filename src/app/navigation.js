import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navigation() {
  return (
    <>
      <nav>
        <ClerkProvider>
          <SignedOut>
            <SignInButton />
            {/* <SignUpButton /> */}
          </SignedOut>

          <button>
            <i>Upload File</i>
          </button>
          <button>
            <i>Library</i>
          </button>
          <button>
            <i>Comments</i>
          </button>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkProvider>
      </nav>
    </>
  );
}
