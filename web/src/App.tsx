import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";

const App = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <>
      <SignedOut>
        <div className="h-screen w-full flex justify-center items-center bg-[#313131]">
          <button className="text-3xl text-[#fcfcfc] bg-blue-700 px-6 py-3 rounded-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition duration-300">
            <SignInButton />
          </button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="h-screen w-full flex justify-center items-center flex-col bg-[#313131]">
          <div className="absolute top-10 right-10">
            <button className="text-3xl text-[#fcfcfc] bg-blue-700 px-6 py-3 rounded-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition duration-300">
              <SignOutButton />
            </button>
          </div>
          <h1 className="text-3xl text-[#fcfcfc]">Welcome {user?.firstName}</h1>
          <h1 className="text-3xl text-[#fcfcfc]">
            Email: {user?.emailAddresses[0].emailAddress}
          </h1>
          <h1 className="text-3xl text-[#fcfcfc]">
            Full name: {user?.fullName}
          </h1>
        </div>
      </SignedIn>
    </>
  );
};

export default App;
