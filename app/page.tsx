import Guest from "@/Components/Guest";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  if( !user) {
    return <Guest/>
  }
  return(
    <div>Hello, Rewa!</div>
  )
}
