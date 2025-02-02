## Small cli app to query webpages using

This is an example cli app showcasing how to use the [ai-url-query](https://www.npmjs.com/package/@sammyl/ai-url-query) package to extract meaninful information from webpages using artificial intelligence.

---

## How to use

Make sure you have [nodejs](https://nodejs.org/en) v20 or latter.

### Clone this repository

```bash
git clone https://github.com/sammyl720/ai-url-query-cli-example
```

#### Install depencencies

```bash
cd ai-url-query-cli-example
npm install
```

### Add OpenAI API Key to `.env` file
```
echo "OPENAI_API_KEY=sk-proj-your-api-key" > .env
```
**WARNING**: Do not share this key.

### Start the app
```
npm start
```

### Enter the webpage url your interested in
```
Enter URL: https://raw.githubusercontent.com/cheeriojs/cheerio/refs/heads/main/Readme.md
```

### Enter your question
```
Enter your question about the URL content: How do you retrieve the text content of the last child element of an element that has an id of currrent-status?
```

### Under the hood
The application performs the following actions under the hood: 

1. It fetches the content of the webpage and retrieves it's text content. 
1. The content is processed into suitable chunks by an ai agent. 
1. The chunks along with their embeddings are saved to a local vector database.
1. The url is considered cached at this point and future url queries for the current url would not trigger the previous steps.
1. The vector database is quered with embeddings of the provided question. The top 3 (by default) matches are used.
1. A prompt is made to to openai's chat completions api with instructions to answer the question using the provided context - The top matches from the vector database.

### Example Output
```markdown
Answer:
To retrieve the text content of the last child element of an element with the id `current-status` using Cheerio, you can follow these steps:

1. **Load the HTML Document**: First, ensure you have the HTML document loaded into Cheerio.

2. **Select the Element**: Use the selector `#current-status` to target the element with that id.

3. **Navigate to the Last Child**: Use the `children()` method to get the child elements and then use the `last()` method to select the last child.

4. **Extract Text Content**: Finally, use the `text()` method to retrieve the text content of this last child element.

Here is an example code snippet demonstrating this:

```js
const cheerio = require('cheerio');

// Load your HTML string
const html = `
<div id="current-status">
    <p>First Child</p>
    <p>Second Child</p>
    <p>Last Child</p>
</div>
`;

const $ = cheerio.load(html);

// Retrieve the text content from the last child of the element with id 'current-status'
const lastChildText = $('#current-status').children().last().text();

console.log(lastChildText); // Output: "Last Child"
```markdown

### Summary:
- Load the HTML into Cheerio.
- Select the element by id `current-status`.
- Retrieve and log the text content of the last child using `children().last().text()`. 

This approach effectively uses Cheerio's capabilities to parse and manipulate HTML, similar to how jQuery would work in a browser environment.
```