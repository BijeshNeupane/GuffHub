export default function hasFollowed(followers: any, userId: any) {
  const followIds = followers.map((f: { followerId: string }) => f.followerId);
  return followIds.includes(userId);
}
