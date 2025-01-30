RESTful-API-node.js

1) http://localhost:8080/feed/post

input:
  fetch('http://localhost:8080/feed/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'A CodePen Post',
      content: 'Created via Codepen!'
    })
  }

output:
{
    "posts": [
        {
            "title": "First Post",
            "content": "This is the first post!"
        }
    ]
}

![image](https://github.com/user-attachments/assets/d5f67c81-b34c-4473-a941-b3c0a55d2120)

----------------------------------------------------------------------------

3) http://localhost:8080/feed/posts

output:
{
  "posts":[
          {"title":"First Post","content":"This is the first post!"}]
}

![image](https://github.com/user-attachments/assets/e4a45510-c0d1-493f-bace-8a8bfcda0a3f)
