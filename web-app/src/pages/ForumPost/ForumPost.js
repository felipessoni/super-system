import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Form, Button } from 'react-bootstrap';
import { BsArrow90DegRight, BsLayers } from 'react-icons/bs';
import { IoIosSend } from 'react-icons/io';
import { getPostAge } from '../../modules/getPostAge';

import styles from './ForumPost.module.css';

import PageContainer from '../../layout/PageContainer';
import GlobalContext from '../../context/GlobalContext';
import LikePostWrapper from '../../components/LikePostWrapper/LikePostWrapper';
import DislikePostWrapper from '../../components/DislikePostWrapper/DislikePostWrapper';
import PostComment from '../../components/PostComment/PostComment';

const ForumPost = props => {

    const { user } = useContext(GlobalContext);
    const { postId } = useParams();

    const [postData, setPostData] = useState({});
    const [imageSrc, setImageSrc] = useState('');

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const updateIsLiked = liked => {
        setIsLiked(liked);
        setIsDisliked(false);
    }
    const updateIsDisliked = disliked => {
        setIsDisliked(disliked);
        setIsLiked(false);
    }

    const thumbsUpImgSrc = 'https://img.icons8.com/material-rounded/24/777777/thumb-up.png';
    const thumbsUpLikedImgSrc = 'https://img.icons8.com/material-rounded/24/0b5ed7/thumb-up.png';
    const thumbsUpDislikedImgSrc = 'https://img.icons8.com/material-rounded/24/cc3a3a/thumb-up.png';

    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    const [showCommentSubmit, setShowCommentSubmit] = useState(false);

    useEffect(()=>{
        // Get specific forum post from server
        fetch(`http://localhost:5000/get-forum-post/${postId}`)
            .then(
                res => res.json()
                    .then(data => {
                        console.log(data);
                        setPostData(data);
                        setImageSrc(`http://localhost:5000/get-image/${data.imgKey || ''}`);
                        const liked = data.likedUsers.includes(user.email);
                        setIsLiked(liked);
                        setIsDisliked(data.dislikedUsers.includes(user.email));
                        setLikeCount(
                            data.likedUsers.length - (liked ? 1 : 0),
                        );
                        setCommentCount(
                            data.comments.length
                            + 
                            data.comments
                                .map(comment => comment.replies)
                                .reduce(
                                    (prevVal, replies) => prevVal + replies.length,
                                    0
                                )
                        );
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }, []);

    return (
        <PageContainer>
            {
                postData ? 

                <div className={styles.wrapper}>
                    <div className={styles.op_content}>
                        <Image
                            src={postData.user && postData.user.userPicture}
                            className={styles.op_picture}
                            referrerPolicy="no-referrer"
                            />
                        <span className={styles.op_name}>{postData.user && postData.user.userName}</span>
                        <span className={styles.post_age}>{getPostAge(postData.createdAt)}</span>
                    </div>
                    <Card.Title className={styles.title}>{postData.title}</Card.Title>
                    <div className={styles.body}>{postData.body}</div>
                    <Image 
                        src={imageSrc} 
                        className={styles.image}
                        onClick={() => { window.open(imageSrc, 'post-image') }}
                        referrerPolicy='no-referrer'
                        />
                    <div className={styles.actions}>
                        <LikePostWrapper
                            liked={isLiked}
                            postId={postId}
                            userEmail={user.email}
                            updateIsLiked={updateIsLiked}>
                            <Button
                                variant='primary'
                                type='submit'
                                className={styles.action_button}>
                                <img 
                                    src={isLiked ? thumbsUpLikedImgSrc : thumbsUpImgSrc}
                                    className={styles.action_icon}/>
                                <span className={styles.like_count}>{(likeCount + (isLiked ? 1 : 0)) || 'Like'}</span>
                            </Button>
                        </LikePostWrapper>
                        <DislikePostWrapper
                            liked={isLiked}
                            postId={postId}
                            userEmail={user.email}
                            updateIsDisliked={updateIsDisliked}>
                            <Button
                                variant='primary'
                                type='submit'
                                className={styles.action_button}>
                                <img 
                                    src={isDisliked ? thumbsUpDislikedImgSrc : thumbsUpImgSrc}
                                    className={styles.dislike_icon}/>
                            </Button>
                        </DislikePostWrapper>
                        <Button variant='primary' className={styles.action_button}>
                            <BsArrow90DegRight className={styles.action_icon}/>
                            <span>Share</span>
                        </Button>
                        <Button variant='primary' className={styles.action_button}>
                            <BsLayers className={styles.action_icon}/>
                            <span>Save</span>
                        </Button>
                    </div>
                    <form action='http://localhost:5000/add-comment' method='POST' className={styles.comment_form}>
                        <Form.Group>
                            <Form.Control 
                                name='commentText'
                                as='textarea'
                                rows={2}
                                placeholder='Comment'
                                autoFocus
                                required
                                onChange={e => setShowCommentSubmit(e.target.value != '')}
                                className={styles.comment_form_text}/>
                        </Form.Group>
                        <input type='hidden' name='postId' value={postId} />
                        {/* <input type='hidden' name='userName' value={user.name} />
                        <input type='hidden' name='userPicture' value={user.picture} /> */}
                        <input type='hidden' name='userId' value={user.id} />
                        {
                            showCommentSubmit &&
                            <Button 
                                variant='primary' 
                                type='submit'
                                className={styles.comment_form_submit}>
                                <IoIosSend style={{marginRight: '0.5em'}}/>
                                <span>Comment</span>
                            </Button>
                        }
                    </form>
                    <span className={styles.comment_count}>{commentCount} comments</span>
                    <div className={styles.comments}>
                        {
                            postData.comments ?

                            <>
                                {
                                    postData.comments.length > 0 ?

                                    postData.comments.map( (item, i) => 
                                        <PostComment 
                                            key={`${i}`}
                                            postId={postId}
                                            {...item}/>
                                    )

                                    :

                                    <div className={styles.no_comments}>Be the first person to comment on this post!</div>
                                }
                            </>

                            :

                            <div>Loading comments...</div>
                        }
                    </div>
                </div>

                :

                <h2>Loading post...</h2>
            }
        </PageContainer>
    );
}

export default ForumPost;