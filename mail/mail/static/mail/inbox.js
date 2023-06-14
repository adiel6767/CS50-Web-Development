document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email()   {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  console.log('TO: ', recipients);

  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
        .then(data => {
      console.log(data);
      get_sent();
    })

    .catch(error => console.log(error));
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('compose-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    send_email();
    load_mailbox('sent')  
  });
});


function get_sent() {
  fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      const emails_view = document.querySelector('#emails-view');
      const email_elements = new Map();

      for (let email of emails) {
        const email_div = document.createElement('div');
        email_div.classList.add('email');
        email_div.innerHTML = `
          <span class="email-recipients">${email.recipients}</span>
          <span class="email-subject">${email.subject}</span>
          <span class="email-timestamp">${email.timestamp}</span>`;
        emails_view.appendChild(email_div);
        email_elements.set(email.id, email_div);
      }
    })
    .catch(error => console.log(error));
}


function get_inbox(){
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails =>{
    const emails_view = document.querySelector('#emails-view');
    const email_elements = new Map(); 
    const content_div_message = document.createElement('div')
    content_div_message.classList.add('content_div_message');


    for (let email of emails){
      const email_div = document.createElement('div');
      email_div.classList.add('email');
      email_div.innerHTML = `
        <span class="email-sender">${email.sender}</span>
        <span class="email-subject">${email.subject}</span>
        <span class="email-timestamp">${email.timestamp}</span>`;

      if (email.read) {
        email_div.style.backgroundColor = 'gray';
      } else {
        email_div.style.backgroundColor = 'white';
      }  

      email_div.addEventListener('click', () => {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })

        console.log('email.read',email.id,email.read)

        email_elements.forEach((element) => {
          if (element !== email_div) {
            element.style.display = 'none';
          }

        });

        email_div.style.display = 'none';
        emails_view.innerHTML = '';
        content_div = document.createElement('div');
        content_div.classList.add('content_div')
        content_div.innerHTML = `
          
          <span class="email-sender"><b>From:</b> ${email.sender}</span><br>
          <span class="email-recipients"><b>To:</b> ${email.recipients} </span><br>
          <span class="email-subject"><b>Subject: </b>${email.subject}</span><br>
          <span class="email-timestamp"><b>Time: </b>${email.timestamp}</span><br>`;
        emails_view.appendChild(content_div);
        console.log(email.body.toString())
        content_div_message.classList.add('content_div')
        const messageLines = email.body.split('\n').map(line => `<div>${line}</div>`).join('\n');
        content_div_message.innerHTML = `<hr><span class="email-body"><b>Message: </b>${messageLines}</span><br>`;
        emails_view.appendChild(content_div_message)

        const reply_button = document.createElement("button")
        reply_button.textContent = "Reply"
        reply_button.classList.add('btn','btn-primary')
        reply_button.setAttribute('id','reply-button')
        content_div_message.appendChild(reply_button)
        
        reply_button.addEventListener('click', function(){

          // Show compose view and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';

          // Clear out composition fields
          document.querySelector('#compose-recipients').value = email.sender;
          const subject = email.subject.includes('RE:') ? email.subject : `RE: ${email.subject}`;
          document.querySelector('#compose-subject').value = subject;
          document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:
${email.body}`;

          document.querySelector('#compose-view h3').innerHTML = "Reply";

        })





        const archive_button = document.createElement("button");
        archive_button.textContent = email.archived ? "Unarchive" : "Archive";
        reply_button.setAttribute('id', 'archive-button');
        archive_button.classList.add('btn', email.archived ? 'btn-danger' : 'btn-primary');

        archive_button.addEventListener('click', function () {
          console.log(email)
          const is_archived = email.archived;
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: !is_archived 
            })
          })
          .then(response => {
            if (response.ok) {
              if (is_archived) {
                archive_button.textContent = "Archive";
                archive_button.classList.add('btn', 'btn-primary');
                archive_button.classList.remove('btn-danger');
                email.archived = false;
            
                        
              } else {
                archive_button.textContent = "Unarchive";
                archive_button.classList.add('btn', 'btn-danger')
                email.archived = true;
                get_inbox()
                load_mailbox('inbox')
                
              }
            }
          })
          .catch(error => console.log(error));
        });
        content_div_message.appendChild(archive_button);
      });
      emails_view.appendChild(email_div);
      email_elements.set(email.id, email_div);

    }
  });
}



document.addEventListener('DOMContentLoaded', function() {
  get_inbox();
});


function get_archive() {
  fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      const emails_view = document.querySelector('#emails-view');
      const email_elements = new Map();
      const content_div = document.createElement('div'); 
      content_div.classList.add('content_div');
      const content_div_message = document.createElement('div')
      content_div_message.classList.add('content_div_message');

      for (let email of emails) {
        if (email.archived) {
          const email_div = document.createElement('div');
          email_div.classList.add('email');
          email_div.id = email.id;
          email_div.innerHTML = `
            <span class="email-sender">${email.sender}</span>
            <span class="email-subject">${email.subject}</span>
            <span class="email-timestamp">${email.timestamp}</span>`;
          emails_view.appendChild(email_div);

          email_div.addEventListener('click', () => {
            email_elements.forEach((element) => {
              if (element !== email_div) {
                element.style.display = 'none';
              }
          });

          email_div.style.display = 'none';
          emails_view.innerHTML = '';
          content_div.classList.add('content_div')
          content_div.innerHTML = `
        
            <span class="email-sender"><b>From:</b> ${email.sender}</span><br>
            <span class="email-recipients"><b>To: </b> ${email.recipients} </span><br>
            <span class="email-subject"><b>Subject: </b>${email.subject}</span><br>
            <span class="email-timestamp"><b>Time: </b>${email.timestamp}</span>`;
        
          emails_view.appendChild(content_div);

          content_div_message.classList.add('content_div')
          const messageLines = email.body.split('\n').map(line => `<div>${line}</div>`).join('\n');
          content_div_message.innerHTML = `<hr><span class="email-body"><b>Message: </b>${messageLines}</span><br>`;
          // content_div_message.innerHTML = `<hr><span class="email-body"><b>Message: </b>${email.body}</span><br><br>`
          emails_view.appendChild(content_div_message)


          const reply_button = document.createElement("button")
          reply_button.textContent = "Reply"
          reply_button.classList.add('btn','btn-primary')
          reply_button.setAttribute('id', 'reply-button');
          content_div_message.appendChild(reply_button)


          reply_button.addEventListener('click', function(){

          // Show compose view and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';

          // Clear out composition fields
          document.querySelector('#compose-recipients').value = email.sender;
          const subject = email.subject.includes('RE:') ? email.subject : `RE: ${email.subject}`;
          document.querySelector('#compose-subject').value = subject;
          document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: 
${email.body}`;

          document.querySelector('#compose-view h3').innerHTML = "Reply";

          })

            const archive_button = document.createElement("button");
            archive_button.textContent = email.archived ? "Unarchive" : "Archive";
            archive_button.classList.add('btn', email.archived ? 'btn-danger' : 'btn-primary');
            reply_button.setAttribute('id', 'archive-button');
            archive_button.addEventListener('click', () => {
              const is_archived = email.archived;
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  archived: !is_archived 
                })
              })
              .then(response => {
                if (response.ok) {
                  console.log('Email archived/unarchived successfully', email.id, email.archived);
                  // switch button text and update email object
                  if (is_archived) {
                    archive_button.textContent = "Archive";
                    archive_button.classList.add('btn','btn-primary');
                    archive_button.classList.remove('btn-danger');
                    email.archived = false;
                    get_inbox()
                    load_mailbox('inbox')
                  } else {
                    archive_button.textContent = "Unarchive";
                    archive_button.classList.add('btn', 'btn-danger')
                    email.archived = true;
                   
                  }
                }
              })
              .catch(error => console.log(error));
            });
            content_div_message.appendChild(archive_button);
          });
          email_elements.set(email.id, email_div);
        }
      }
    })
    .catch(error => console.log(error));
}



window.onload = function() {
  document.querySelector('#sent').addEventListener('click', get_sent);
  document.querySelector('#inbox').addEventListener('click', get_inbox);
  document.querySelector('#archived').addEventListener('click', get_archive);
};

