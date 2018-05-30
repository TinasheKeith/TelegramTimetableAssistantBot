const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('d83abda677934c9d8601b0db7fae4d06');

newsapi.v2.topHeadlines({
  sources: 'the-verge',
  language: 'en',
}).then(response => {
  console.log(response.articles[0]);
});

const main = async() => {
    let {article} = await 
}