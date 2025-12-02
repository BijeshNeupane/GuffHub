import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import axiosInstance from "../../config/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import timeFormatter from "../../helper/timeHelper";

const Center = () => {
  const [posts, setPosts] = useState([]);
  const { id } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axiosInstance.get("/post");
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  console.log(posts);
  return (
    <div className="px-10 flex flex-col gap-10">
      {/* <PostCard
        profilePic={
          "https://scontent.fktm8-1.fna.fbcdn.net/v/t39.30808-6/508566431_1434372257744978_8512150965780079989_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=kpnJJJWJuW8Q7kNvwEwV9Qt&_nc_oc=Adlo964c97qgqbxmvff3CWnXOMh5LpABNaP78_yspvKRkjze4kz0cuoTszgiNUfN3BI2ZNhiJxOKV-VJzJq7NzY_&_nc_zt=23&_nc_ht=scontent.fktm8-1.fna&_nc_gid=5bDvkRu9XKluBURQimr4Yw&oh=00_Afj822GslcS6Mdv2js6TGS7EpUBkemoMePe4pYrNIXtFcg&oe=692E30CB"
        }
        name={"Bijesh Neupane"}
        time={"1 hour ago"}
        description={"Stumbled across this wonderful place."}
        image={[
          "https://images.unsplash.com/photo-1528653422851-5cf014de5988?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ]}
        likesCount={5}
        commentsCount={1}
        liked={false}
      />
      <PostCard
        profilePic={
          "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?semt=ais_hybrid&w=740&q=80"
        }
        name={"Keshar Yadav"}
        time={"5 days ago"}
        description={
          "Neko is hungry, ofcourse I mean he hasn't eaten in 10 minutes 🙂. I dont know why is he like this...."
        }
        image={[
          "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ]}
        likesCount={324}
        commentsCount={20}
        liked={true}
      /> */}

      {posts.map((post: any) => {
        return (
          <PostCard
            profilePic={post.author.profileImageUrl}
            name={post.author.username}
            time={timeFormatter(post.createdAt)}
            description={post.content}
            image={post.media.map((media: any) => media.imageUrl)}
            likesCount={post._count.likes}
            commentsCount={post._count.likes}
            liked={post.likes.includes(id)}
          />
        );
      })}
    </div>
  );
};

export default Center;
