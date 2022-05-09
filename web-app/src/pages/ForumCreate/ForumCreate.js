import React, {useState, useEffect} from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import {Navigate, useNavigate} from 'react-router-dom';

import styles from './ForumCreate.module.css';

const ForumCreate = props=>{

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedImage, setSelectedImage] = useState(undefined);
    const [preview, setPreview] = useState(undefined);

    const onImageChange = e=>{
        if(!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        setSelectedImage(file); 
    }

    // const onSubmit = async e=>{
        
    //     e.preventDefault();
        
    //     const serverUrl = 'http://localhost:5000/add-forum-post';

    //     const formData = new FormData();
    //     formData.append('title', title);
    //     formData.append('body', body);
    //     formData.append('file', selectedImage);
        
    //     const config = {
    //         headers: {
    //             'content-type': 'multipart/form-data',
    //         }
    //     }

    //     axios.post(serverUrl, formData, config)
    //         .then(res => {
    //             console.log('redirect back to forum page');
    //             console.log(res);
    //             setRedirectToForum(true);
    //             navigate('/forum');
    //         })
    //         .catch(err => console.log(err));
    // }

    useEffect(()=>{
        if (!selectedImage) return;

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    return (
        <div className='container'>
            <form action='http://localhost:5000/add-forum-post' method='POST' encType='multipart/form-data' className={styles.form}>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control name='title' type='input' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} required/>
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Image</Form.Label>
                    <Form.Control name='file' type='file' accept='image/png, image/jpeg' size='sm' onChange={onImageChange}/>
                    {selectedImage && <Image src={preview} className={styles.preview}/>}
                </Form.Group>
                <Form.Group className={`mb-3`}>
                    <Form.Label>Text</Form.Label>
                    <Form.Control name='body' as='textarea' rows={3} placeholder='Text' value={body} onChange={e => setBody(e.target.value)}/>
                </Form.Group>
                <Button variant='primary' type='submit'>Post</Button>
            </form>
        </div>
    );
}

export default ForumCreate;