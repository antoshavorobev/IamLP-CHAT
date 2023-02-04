import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const userHandle = `@AV`;

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like);
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply);
    
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick();
    }
    
    else if(e.target.dataset.delete) {
        deleteMessage(e.target.dataset.delete);
    } 
});
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--;
    }
    else{
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId){
    
    const targetTweetObj = tweetsData.filter(function(tweet){
        
        return tweet.uuid === tweetId;
    })[0];
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    }
    else{
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
    
    
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input');

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@AV`,
            profilePic: `images/AV.jpeg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });
    render();
    tweetInput.value = '';
    }

}

function getFeedHtml(){
    let feedHtml = ``;
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = '';
        
        if (tweet.isLiked){
            likeIconClass = 'liked';
        }
        
        let retweetIconClass = '';
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted';
        }
        
        let repliesHtml = '';
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            });
        }
        
          
        feedHtml += `
<div class="tweet" id="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <div class="top-wrap"
                    <p class="handle">${tweet.handle}</p>
                    <img src="images/menu.png" class="popup" id="popup" 
                    data-popup="${tweet.uuid}">
                </div>
            
        <div id="modal" class="hidden modal">
           <div class="modal-buttons">
            <a href=# class="modal-button modal-button-delete" id="modal-button-delete" data-delete="${tweet.uuid}">DELETE</a>
            
            <a href=# class="modal-button modal-button-share">SHARE</a>
            
            <a href="mailto:" class="modal-button modal-button-email">SEND EMAIL</a>
           </div>
        </div>        
        
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   });
   return feedHtml;
}

function getPopupMenu(){

const tweets = document.querySelectorAll('.tweet');

tweets.forEach(tweet => {
  const popup = tweet.querySelector('.popup');
  const modal = tweet.querySelector('.modal');

popup.addEventListener('click', () => {
modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        });
    });
}


function deleteMessage(tweetId) {
   
    
    let index = tweetsData.findIndex(obj => obj.uuid === tweetId)
    
    if (tweetsData[index].handle === userHandle) {
    tweetsData.splice(index, 1);

    render();
    
    } else  {alert("Nah, you can't delete this massege")};
}


function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
    getPopupMenu();
}

render();


