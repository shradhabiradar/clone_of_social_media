{
    let createPost = function(){
        let newForm = $('#home_posts');
        newForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newForm.serialize(),
                success: function(data){
                    //refer "inspect"
                    let postData = newPostDom(data.data.post);
                    $('#posts-division>ul').prepend(postData);
                    deletepost($(' .delete-post', postData))
                }, error: (function(err){
                    console.log(error.responseText);
                })
            })
        })
    }

    //now its time to display
    let newPostDom = function(post){
        return $(`<li id="post-${post._id }">
        <p>
                <small>
                    <a class=" delete-post" href="/posts/destroy/${post._id }">xx</a>
                </small>
              
                ${ post.content}
                <br>
                <small>
                ${ post.user.name}
                </small>
            
        </p>
        
        <div class="post-comments">
            
                <form action="/comments/create" method="POST">
                    <textarea name="content" cols="30" rows="1" placeholder="add comment....."></textarea>
                    <input type="hidden" name="post" value="${post._id }">
                    <input type="submit" value="comment">
                </form>
           
        
            <div class="post-comments-list">
                <ul id="post-commnets-${post._id }"></ul>
            </div>
        </div>
    </li>`)
    }

    let deletepost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post._id}`).remove();
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    createPost();
}