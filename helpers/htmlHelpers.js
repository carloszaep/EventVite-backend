import escapeHtml from 'escape-html'

// Helper function to generate the styled HTML confirmation page
export const generateConfirmationPage = (contact, event) => {
  const date = new Date(event.eventDate).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  const confirmationPage = `   
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Invite card</title>
</head>
<body>
<div class="wrapper">
<div class="container">
        <div class="columns form_container">
            <div class="column is-half spooky_bg2">
            </div>
            <div class="column is-half input_container">
                <h1>EventVite</h1>
                <h1>${escapeHtml(contact.name)}, You're Invited!</h1>
                <h3>We're Delighted to Have You Join Us</h3>
                <h2>${escapeHtml(event.name)}</h2>
                <h3>On ${escapeHtml(date)}.</h3>
                ${event.address ? `<h3>At ${event.address}.</h3>` : ''}               
                <h2>you just confirmed</h2>
                <p>Your presence is the missing piece that will make this 
                event truly special. We can't wait to see you there!</p>               
            </div>
            
        </div>
    </div>
    
</div>
<style>     

body{
background-color: #21D4FD;
background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);
}
.wrapper {
display: flex;
align-items: center;
justify-content: center;
height: 100vh;
}
.form_container {
-webkit-box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        border-radius: 20px;
        background-color: #12192c;
    }
.input_container {
    text-align: center;
padding: 4em;
position: relative;
color: #fff;
}
.input_container h1{
font-size: 4.5rem;
}
.input_container h2{
    font-style: oblique;
font-size: 5rem;
    color: #f1ecec;
}
.input_container p{
font-size: 1.4rem;
    color: #ffffff;
}
.input_container h3{
    font-style: italic;
font-size: 3rem;
    color: #9b9090;
}
.credit {
text-decoration: none;
color: #B721FF;
font-weight: 800;
}

.credit {
  margin: 10px;
}
</style> 
</body>
</html>`

  return confirmationPage
}
