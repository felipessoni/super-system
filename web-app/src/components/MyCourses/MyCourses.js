import React from 'react';

import styles from './MyCourses.module.css';
import { Card, ProgressBar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { CourseData } from './MyCoursesData';


class MyCourses extends React.Component{
    constructor(props) {
        super(props);
    }

    render(props) {
        return (
            <div>
                <Card>     
                    <Card.Title>My Courses</Card.Title>       
                    {CourseData.map((item, index) => 
                        <Link key={`${index}`} to={`/home/${item.code}`} className={styles.link}>
                        <Card className={styles.smallCard}>
                            <Card.Img variant="top" src={item.pic} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    {item.desc}
                                </Card.Text>
                                <ProgressBar now={item.progress} label={`${item.progress}%`} />
                            </Card.Body>
                        </Card>  
                        </Link>   
                    )}  
                             
                </Card>
            </div>
        )
    }
}

export default MyCourses;