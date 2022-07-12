import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { BsStarFill, BsStar } from 'react-icons/bs';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useScreenType } from '../../hooks/useScreenType';
import { IoAddSharp } from 'react-icons/io5';
import { BsFillTrash2Fill, BsPencilFill, BsFillFileEarmarkFontFill } from 'react-icons/bs';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ChallengeList.module.css';
import Swal from 'sweetalert2'
import GlobalContext from '../../context/GlobalContext';

import PageContainer from '../../layout/PageContainer';

const ChallengeList = props => {

    const screenType = useScreenType();
    const { user } = useContext(GlobalContext);
    const [userRoles, setUserRoles] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [usersCompleted, setUsersCompleted] = useState([]);

    const getRating = (rate, ratings) => {
        if (rate === 0) {
            return 0;
        }
        else {
            return Math.floor(rate / ratings);
        }
    }

    const rating = (rate, ratings) => {
        var rating = getRating(rate, ratings);
        if (ratings === 0 || rate === 0) {
            rating = 0;
        }

        const items = [];

        for (var i = 0; i < rating; i++) {
            items.push(<BsStarFill key={`${i}`} />);
        }

        for (var j = i; j < 5 - rating + i; j++) {
            items.push(<BsStar key={`${j}`} />);
        }

        return items;
    }

    useEffect(() => {
        getUser();
        getChallenges();
    }, []);

    const getChallenges = () => {
        // Get all challenges from server
        fetch('http://localhost:5000/challenge/read')
            .then(
                res => res.json()
                    .then(data => {
                        // Set challenges
                        setChallenges(data);
                        setUsersCompleted(data.usersCompleted);
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
    }

    const deleteBtn = (userId, itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your challenge has been deleted.',
                    'success'
                )
                deleteChallenge(userId, itemId);

            }
        })
    }

    const deleteChallenge = (userId, itemId) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ userId, itemId }),
        }

        console.log(`Deleting challenge...`);

        const deleteItemUrl = 'http://localhost:5000/challenge/delete';

        fetch(deleteItemUrl, options)
            .then(res => {
                console.log('Delete challenge');
                getChallenges();
            })
            .catch(err => console.log(err));
    }

    const getUser = async userEmail => {
        const getUserUrl = `http://localhost:5000/get-user/${user.email}`;

        const res = await fetch(getUserUrl);
        const userData = await res.json();
        setUserRoles(userData.userRoles);
    }

    const isOwner = (index) => {
        if (user.id === challenges[index].user._id || userRoles.includes('Admin')) {
            return true;
        }
        return false;
    }

    const isCompleted = (index) => {
        console.log(challenges[index].usersCompleted)
        if (challenges[index].usersCompleted.includes(user.id)) {
            return true;
        }
        return false;
    }

    return (
        <PageContainer>
            <header className={`${styles.header} ${screenType != 'show-sidebar' && styles.add_top}`}>
                <input type='text' placeholder='Search filters' className={styles.filter} />
                <Link to='/challenges/create'>
                    <Button
                        variant='primary'
                        className={styles.create_button}>
                        <IoAddSharp className={styles.create_icon} />
                    </Button>
                </Link>
            </header>
            <div className={styles.wrapper}>
                {
                    challenges.sort((a, b) => getRating(a.rating, a.numberOfRatings) > getRating(b.rating, b.numberOfRatings) ? -1 : 1).map((item, i) =>
                    (
                        <div key={`${i}`} className={styles.challenge}>
                            <Link to={`/challenges/${item._id}`} className={styles.challenge_info}>
                                <Row>
                                    <Col className={styles.challenge_details}>
                                        <h5>{item.title}</h5>
                                        <span>By: {item.user.userName}</span>
                                        <span>Rating: {rating(item.rating, item.numberOfRatings)}</span>
                                    </Col>
                                    <Col>
                                        <div className={styles.challenge_points}>
                                            <h1>{item.pointCount}</h1>
                                            <span>points</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Link>
                            <div className={styles.buttons}>
                                {
                                    isCompleted(i) ?
                                        <Link to={`/challenges/answers/${item._id}`}>
                                            <Button
                                                variant='primary'
                                                className={styles.answer_btn}>
                                                <BsFillFileEarmarkFontFill
                                                    className={styles.icon} />
                                            </Button>
                                        </Link>
                                        :
                                        <span></span>
                                }
                                {
                                    isOwner(i) ?
                                        <div>
                                            <Link to={`/challenges/update/${item._id}`}>
                                                <Button
                                                    variant='primary'
                                                    className={styles.edit_btn}>
                                                    <BsPencilFill
                                                        className={styles.icon} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant='primary'
                                                onClick={e => deleteBtn(item.user.userId, item._id)}
                                                className={styles.delete_btn}>
                                                <BsFillTrash2Fill
                                                    className={styles.icon} />
                                            </Button>
                                        </div>
                                        :
                                        <span></span>
                                }
                            </div>
                        </div>
                    )
                    )
                }
            </div>
        </PageContainer>
    );
}

export default ChallengeList;