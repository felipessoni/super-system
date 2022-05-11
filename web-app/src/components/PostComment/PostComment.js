import React, { useState, useEffect } from 'react';
import { getPostAge } from '../../modules/getPostAge';
import { Card, Image, Button, Form } from 'react-bootstrap';
import { BsReply } from 'react-icons/bs';

import styles from './PostComment.module.css';

import PostReply from '../PostReply/PostReply';

const PostComment = props => {
    
    const { postId, _id: commentId, userName, userPicture, text, replies, createdAt } = props;

    const [openReply, setOpenReply] = useState(false);

    useEffect(() => {

    }, []);

    return (
        <Card className={styles.comment}>
            <div className={styles.comment_user_content}>
                <Image 
                    src={userPicture}
                    className={styles.comment_user_picture}
                    referrerPolicy="no-referrer"/>
                <span className={styles.comment_user_name}>{userName}</span>
                <span className={styles.comment_age}>{getPostAge(createdAt)}</span>
            </div>
            <span className={styles.comment_text}>{text}</span>
            <div className={styles.comment_actions}>
                <Button
                    variant='primary'
                    className={styles.comment_action_button}
                    onClick={e => {
                        setOpenReply(!openReply);
                    }}>

                    <BsReply className={styles.comment_action_icon}/>
                    <span>Reply</span>

                </Button>
            </div>
            {
                openReply ?

                <form action='http://localhost:5000/add-reply-to-comment' method='POST' className={styles.reply_form}>

                    <input type='hidden' name='postId' value={postId} />
                    <input type='hidden' name='commentId' value={commentId} />
                    <input type='hidden' name='userName' value={userName} />
                    <input type='hidden' name='userPicture' value={userPicture} />

                    <Form.Group className={styles.reply_form_text}>
                        <Form.Control name='replyText' as='textarea' placeholder='Reply' rows={2}/>
                    </Form.Group>

                    <Button
                        variant='primary'
                        type='submit'
                        className={styles.reply_form_submit}
                        >
                        <BsReply className={styles.reply_form_submit_icon}/>
                        <span>Reply</span>
                    </Button>

                </form>

                :

                null
            }
            <div className={styles.replies}>
                {
                    replies.map( (item, i) => 
                        <PostReply 
                            key={`${i}`}
                            postId={postId}
                            {...item}/>
                    )
                }
            </div>
        </Card>
    );
}

export default PostComment;