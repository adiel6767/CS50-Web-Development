// const post_author_button = document.querySelectorAll('.post_author_button')
// const profile_button = document.getElementById('profile');
// const all_post_button = document.getElementById('all-post');
// const following_button = document.getElementById('following');
// divs to hide and display
const post_form = document.getElementById('post_form_border');
const following_section = document.getElementById('following_section')
// const username_profile = document.getElementById('username_profile')
// const title = document.getElementById('title')
//follow_unfollow_form
// const follow_unfollow_form = document.getElementById('follow_unfollow_form')
const follow_unfollow_button = document.getElementById('follow_unfollow_')
//followers and following count divs
const followers_div = document.getElementById('followers_count')
const following_div = document.getElementById('following_count')
//edit section 
const edit = document.getElementById('edit-')

document.addEventListener('DOMContentLoaded', () => {
  // history.pushState({}, '', '/?page=1');
  following_section.style.display = 'block';
  follow_unfollow_button.style.display = 'none'
  post_form.style.display = 'none';
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Make post Post request to index
const postForm = document.getElementById('post_form');
const csrfInput = postForm.querySelector('input[name=csrfmiddlewaretoken]');
const csrfToken = csrfInput ? csrfInput.value : null;

//like and unlike changing heart button color without refreshing
document.addEventListener('DOMContentLoaded', function() {
  var like_forms = num_posts;
  for (var i = 1; i <= like_forms; i++) {
    var like_form = document.getElementById('like-form_' + i);
    
    like_form.addEventListener('submit', (event) => {
      event.preventDefault();

      console.log(like_form)

      const postId = event.target.querySelector('[name=post-id]').value;
      var like_button = document.getElementById('like-button_'+ postId)
      console.log(like_button)
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
        .then(data => { console.log('POSTID',postId)

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
      console.log('edit')
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