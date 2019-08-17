// required packages
const fetch = require("node-fetch");

// Dato CMS token from .env
const token = process.env.DATOCMS_TOKEN;

// GraphQL query to execture
const blogpostsQuery = `
  {
    allBlogposts(orderBy: _createdAt_DESC, filter: {_status: {eq: published}}) {
      id
      title
      slug
      intro
      body(markdown: true)
      _createdAt
      image {
        url
        alt
      }
    }
  }
`;

// get blogposts
// see https://www.datocms.com/docs/content-delivery-api/first-request#vanilla-js-example
function getAllBlogposts() {
  // fetch data
  const data = fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: blogpostsQuery
    })
  })
    // parse as JSON
    .then(res => res.json())

    // Handle JSON data
    .then(res => {
      // handle Dato CMS errors response
      if (res.errors) {
        res.errors.forEach(error => {
          console.log(error.message);
        });
        throw new Error("DatoCMS errors");
      }

      // get blogposts data from response
      let blogpostsData = res.data.allBlogposts;

      // format data
      let blogpostsFormatted = blogpostsData.map(item => {
        return {
          id: item.id,
          date: item._createdAt,
          title: item.title,
          slug: item.slug,
          image: item.image.url,
          imageAlt: item.image.alt,
          summary: item.intro,
          body: item.body
        };
      });

      // return formatted data
      return blogpostsFormatted;
    })
    .catch(error => {
      console.log(error);
    });

  // return data
  return data;
}

// export for 11ty
module.exports = getAllBlogposts;