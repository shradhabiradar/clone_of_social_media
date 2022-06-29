const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comment/new_comment.ejs')

    nodeMailer.transporter.sendMail({
        from: 'shradhab290@gmail.com',
        to: comment.user.email,
        subject: "new comment published",
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sedning mail', err); return}

        console.log('message sent', info);
        return;
    })
}