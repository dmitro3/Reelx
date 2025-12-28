import Image from "next/image";
import { Loading } from "@/shared/ui/loading/loading";
import { Error } from "@/widgets/error/error";
import ProfilePage from "./(main)/profile/page";
import { NavBar } from "@/shared/layout/NavBar/NavBar";

export default function Home() {
  return (
    <div >
     {/* <Error errorSubText="Error Text" errorText="Error SubText"/>
     <Loading/> */}
     <ProfilePage/>
      <NavBar/>
    </div>
  );
}
