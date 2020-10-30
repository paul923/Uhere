export function getAvatarImage(avatarURI){
  switch(avatarURI) {
    case "avatar-rabbit":
      return require("../assets/images/avatars/avatar_rabbit/avatar_rabbit.png");
    case "avatar-cat":
      return require("../assets/images/avatars/avatar_cat/avatar_cat.png");
    case "avatar-dog":
      return require("../assets/images/avatars/avatar_dog/avatar_dog.png");
    case "avatar-squirrel":
      return require("../assets/images/avatars/avatar_squirrel/avatar_squirrel.png");
    case "avatar-whale":
      return require("../assets/images/avatars/avatar_whale/avatar_whale.png");
    case "avatar-turtle":
      return require("../assets/images/avatars/avatar_turtle/avatar_turtle.png");
    case "avatar-croco":
      return require("../assets/images/avatars/avatar_croco/avatar_croco.png");
    case "avatar-bird":
      return require("../assets/images/avatars/avatar_bird/avatar_bird.png");
    case "avatar-elephant":
      return require("../assets/images/avatars/avatar_elephant/avatar_elephant.png");
  }
}

export function getCountImage(count) {
  // switch(count) {
  //   case "count-1":
  //     return require("");
  //   case "count-2":
  //     return require("");
  //   case "count-3":
  //     return require("");
  // }
}

export const avatarData = [
  {AvatarURI: "avatar-rabbit"},
  {AvatarURI: "avatar-cat"},
  {AvatarURI: "avatar-dog"},
  {AvatarURI: "avatar-squirrel"},
  {AvatarURI: "avatar-whale"},
  {AvatarURI: "avatar-turtle"},
]
