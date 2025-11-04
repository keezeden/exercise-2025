# Approach to solving tasks

I started with the react performance as I was confident I could implement this with minimal research. I started by investigating how the search and filtering was handled, but realised each performance issue contributed significantly to the over latency, so I stubbed out a few of them to better see if my changes were improving performance. This took me ~1 hour to refactor the main search and filtering to be more optimal, and add `react-window` for virtualization. There is still some latency which I didnt have time to investigate.

Deciding to move along to other tasks, I then used `codex` to summarise the other problems and give me a general summary and problem files to investigate. Before continuing I took a lunch break and came back a few hours later if youre concerned with the gap in my commit times.

I started with the `registerUser` function, and after reading the `Effect` docs and getting a general idea of what it was used for, I asked `codex` how it would refactor the `registerUser` function using Effect. I used its suggestions to hoist the error types and convert to Effect generators and `Effect.tryPromise`. I made this decision as I saw we had tests to ensure functional parity once the AI change was made.

I then realised I had forgot to reimplement my stubbed highlights in the performance demo item, so I used `codex` to investigate the regex, which it found a problem with the item name/description being split into characters causing the highlight not to work.

Finally, I decided to end by quickly fixing the data leak of the users password hash caused by `getUserById` returning the entire user. I removed the key, and updated the types for the project.
