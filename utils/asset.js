export function getAvatarImage(avatarURI){
  switch(avatarURI) {
    case "avatar-rabbit":
      return require("../assets/images/avatars/avatar_rabbit/png/Group2032.imageset/Group2032.png");
    case "avatar-cat":
      return require("../assets/images/avatars/avatar_cat/png/Group2028.imageset/Group2028.png");
    case "avatar-dog":
      return require("../assets/images/avatars/avatar_dog/png/Group2026.imageset/Group2026.png");
    case "avatar-squirrel":
      return require("../assets/images/avatars/avatar_squirrel/png/Group2030.imageset/Group2030.png");
    case "avatar-whale":
      return require("../assets/images/avatars/avatar_whale/png/Group2031.imageset/Group2031.png");
    case "avatar-turtle":
      return require("../assets/images/avatars/avatar_turtle/png/Group2027.imageset/Group2027.png");
  }
}

export const avatarData = [
  {AvatarURI: "avatar-rabbit"},
  {AvatarURI: "avatar-cat"},
  {AvatarURI: "avatar-dog"},
  {AvatarURI: "avatar-squirrel"},
  {AvatarURI: "avatar-whale"},
  {AvatarURI: "avatar-turtle"},
]
