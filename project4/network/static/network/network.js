//////////////////////////////////////////////////////////////////////////////////////////////////////
// Make post Post request to index
const postForm = document.getElementById('post_form');
const csrfInput = postForm.querySelector('input[name=csrfmiddlewaretoken]');
const csrfToken = csrfInput ? csrfInput.value : null;


///////////////////////////////////////////////////////////////////////////////////////////////////////
postForm.addEventListener('submit', (event) => {
  const userPost = document.getElementById('input-post').value;
  fetch('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrfToken,
    },
    body: `input-post=${encodeURIComponent(userPost)}` // encode the user input
  })
    .then(response => response.json())
    .then(data => {
      console.log('success')
  })
  .catch(error => console.error(error));
});


////////////////////////////////////////////////////////////////////////////////////////////////////////
// divs to hide and display
const post_form = document.getElementById('post_form_border');
const following_section = document.getElementById('following_section')
//edit section 
const edit = document.getElementById('edit-')

///////////////////////////////////////////////////////////////////////////////////////////////////////
//hide stuff when the page is loaded 
document.addEventListener('DOMContentLoaded', () => {
  following_section.style.display = 'none';
});




////////////////////////////////////////////////////////////////////////////////////////////////////////
//like and unlike changing heart button color without refreshing
document.addEventListener('DOMContentLoaded', function() {
  var like_forms = num_posts;
  for (var i = 1; i <= like_forms; i++) {
    var like_form = document.getElementById('like-form_' + i);
    
    like_form.addEventListener('submit', (event) => {
      event.preventDefault();


      const postId = event.target.querySelector('[name=post-id]').value;
      var like_button = document.getElementById('like-button_'+ postId)
      const csrfInput = like_form.querySelector('input[name=csrfmiddlewaretoken]');
      console.log(csrfInput)
      const csrfToken = csrfInput ? csrfInput.value : null;

      if (!csrfToken) {
        console.error('CSRF token not found');
        return;
      }
      fetch('like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken,
        },
        body: `post-id=${postId}`
      })
        .then(response => response.json())
        .then(data => { 

          const likeCountSpan = document.getElementById('like-count-' + postId);
          if (likeCountSpan) {
            likeCountSpan.innerText = data.likes;

            if (data.user_liked) {
              like_button.classList.remove('like-form');
              like_button.classList.add('red-heart');
            } else {
              like_button.classList.remove('red-heart');
              like_button.classList.add('like-form');
            }
           }
        })
        .catch(error => console.error(error));
    });
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////
//follow_unfollow request
follow_unfollow_form.addEventListener('submit',(event) => {
  event.preventDefault();

  var username_profile = document.getElementById('username_profile');
  var username = username_profile.innerText;


  const csrfToken = csrfInput ? csrfInput.value : null;
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    fetch('follow_unfollow_user',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrfToken,
      },
      body: `user_followed=${username}`
    })
      .then(response => response.json())
      .then(data => { 

        console.log(user_JsonParse)


          followers_div.innerText = data.following_count_data
          
          if(data.existing_follower){
            follow_unfollow_button.classList.remove('btn-danger')
            follow_unfollow_button.classList.add('btn-primary')
            follow_unfollow_button.innerText = 'follow'
            followingCount = data.following_count_data
          }
          else{
      
            follow_unfollow_button.classList.remove('btn-primary')
            follow_unfollow_button.classList.add('btn-danger')
            follow_unfollow_button.innerText = 'Unfollow'
            followers_div.innerText = data.following_count_data
            followingCount = data.following_count_data

          }


    })
    .catch(error => console.error(error));

})
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Edit post 
document.addEventListener('DOMContentLoaded', function() {
  number_posts = num_posts;
  for (var i = 1; i <= number_posts; i++) {
    const edit = document.getElementById('edit-' + i);
    const post_contents = document.getElementById('post-elements-' + i);
    const All_Post_div = document.getElementById('All-Post-div-' + i);
    const post_text = document.getElementById('post_content-' + i);
    const post_data_post_id = document.getElementById('post_content-' + i);

    edit.addEventListener('click', function (event) {
      event.preventDefault();

      const postId = post_data_post_id.getAttribute('data-post-id');
      console.log('postId', postId);

      const text_box = document.createElement('textarea');
      text_box.type = 'text';
      text_box.classList.add('form-control');
      text_box.value = post_text.innerText;
      All_Post_div.appendChild(text_box);

      const save_button = document.createElement('button');
      save_button.classList.add('btn', 'btn-primary');
      save_button.textContent = 'Save';
      save_button.type = 'submit';
      All_Post_div.appendChild(save_button);

      text_box.style.resize = 'none';
      All_Post_div.style.display = 'block';
      post_contents.style.display = 'none';

      save_button.addEventListener('click', (event) => {
        event.preventDefault();
        post_contents.style.display = 'block';
        text_box.style.display = 'none';
        save_button.style.display = 'none';

        const userPost = text_box.value;
        const url = `/posts/${postId}/`;
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          // `input-post=${encodeURIComponent(userPost)}`
          body: JSON.stringify({ 'input-post': userPost }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('success:', data);
            // if(data.post > 0){
            post_text.innerText = data.post
            All_Post_div.style.display = 'block';
            post_contents.style.display = 'block'

          })
          .catch(error => console.error(error));
      });
    });
  }
})

//////////////////////////////////////////////////////////////////////////


