// const getRole = (index: number): "user"|"assistant" => {
//   if (index===0) {
//     return "user"
//   } else if (index%2) {
//     return "user"
//   } else { 
//     return "assistant"
//   }
// }

export const concatStory = (fullStory: string, messages: any[]) => {
  console.log("fullstory:", fullStory)
  if (fullStory) {
    const prevFullStoryList: string[] = fullStory.split(";")

    console.log("prevFullStoryList", prevFullStoryList)

    const reformattedFullStoryList: any[] = prevFullStoryList.flatMap((storyPart: string, index: number) => [{
      role: "system",
      content: storyPart
    }]
    ).filter((storyPart: any) => storyPart.content!==""); // clearing from empty messages. Empty messages cause errors

    const fullStoryList = reformattedFullStoryList.concat(messages)
    return fullStoryList
  }
  return []
}