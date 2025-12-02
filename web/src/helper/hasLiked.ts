export default function hasLiked(likes: any, userId: any) {
  if (!likes) return false;
  const likeIds = likes?.map((f: { userId: string }) => f.userId);
  return likeIds.includes(userId);
}
