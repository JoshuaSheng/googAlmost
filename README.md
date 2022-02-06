## GoogAlmost:
Ever have that one word on the tip of your tongue... but you don't know what it is? Goog... almost helps you find the right word you need! Useful for non-native english speakers. Try it out at: https://joshuasheng.com/googAlmost Access the devpost at: https://devpost.com/software/goog-almost

![googAlmost](https://user-images.githubusercontent.com/65204925/152703281-58ee8a55-121f-4d4b-9914-64666a55cd4e.PNG)

### Inspiration

I got inspired to build this project while messing around with google autocomplete one day. I wanted to build something like that and looked into a few algorithms and found one I was interested in. XHacks happened to come along at a good time so I decided to build an app around it. The inspiration for the app was my learning Japanese at the time. Looking up a word I vaguely remembered lead me to a completely different word I knew I was incorrect. No matter what I tried, I couldn't get the right word and the whole experience was incredibly frustrating.

### What it does
The concept is that people who have words on the tip of their tongues but can't quite seem to get correct come to googAlmost. They can search up the word that is pretty close, and look through a list of similar words with their dictionary definitions to find the right word. The word-generator/spellcheck is dynamic, and runs in real-time.

### How we built it
I used a complex data structure called a BK tree to build this project. It operates on something called the Levenshtein distance, which is the minimum number of edits to get from one word to the next. By using the Levenshtein distance, you can find words that are similar to the target word, which is how modern spell-check works. The BK-tree optimizes this Levenshtein distance so you don't have to compare a word to every other word every time you run the spell-check. The result is a blazingly fast spellcheck that can run in real time with a list of tens or hundreds of thousands of words. From then, I hooked it up to a free dictionary api and parsed it to output to the DOM.

### Challenges we ran into
One of the biggest challenges was writing and optimizing the BK Tree. I had never built a BK Tree before, so I was learning as I went. It was important to get the algorithm for both the BK Tree and the Levenshtein distance function correct, as it could mean the difference between O(x^n) and O(n) time. The Levenshtein distance was particularly tricky and needed some DP to optimize. Another challenge was building the UI for the website. I wanted to get it similar to Google's, because they were a big inspiration for the project and the namesake, but it was difficult to get all the styling just right, particularly the search bar dropdown.

### Accomplishments that we're proud of
I'm happy with the fact that the algorithm is so quick that it can run on the browser without the need for persistence. Originally, I thought I would need a database, but with the BK Tree it wasn't necessary.

### What we learned
I learned a lot about algorithms and CSS design, and also about pacing myself and making apps in general, as this is my first full coding hackathon.

### What's next for Goog...almost
There's still a lot to do. I can easily extend this to other languages, as the Levenshtein distance only requires an alphabet. I can also optimize the algorithm some more, factoring in common mistakes. At some point, I could even replace the algorithm with ML if I gather enough data. Lastly, I was thinking about making a cache to store previous searches so users could come back in case they forget.
