import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl'

function RenderDish({ dish }) {
    if (dish != null) {
        return (
            <Card className="col-12 col-md-5 m-1">
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name}></CardImg>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        );
    } else {
        return (
            <div></div>
        );
    }
}

function RenderComments({ comments, addComment, dishId }) {
    if (comments) {
        const commentsComponent = comments.map((comment) => {
            return (
                <ul key={comment.id} className="list-unstyled">
                    <li>{comment.comment}</li>
                    <li>-- {comment.author}, {(new Intl.DateTimeFormat('en-US', { year: "numeric", month: 'short', day: "2-digit" }).format(new Date(Date.parse(comment.date))))}</li>
                </ul>
            );
        });
        return (
            <div className="col-12 col-md-5 m-1"><h4>Comments</h4>{commentsComponent}<CommentForm addComment={addComment} dishId={dishId}></CommentForm></div>
        );
    } else {
        return (
            <div className="col-12 col-md-5 m-1"><CommentForm addComment={addComment} dishId={dishId}></CommentForm></div>
        );
    }
}

const maxLength = (len) => val => !(val) || (val.length <= len);
const minLength = (len) => val => (val) && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values){
        this.toggleModal();
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return (
            <div>
                <Button outline color="secondary" onClick={this.toggleModal.bind(this)}><span className="fa fa-pencil fa-lg"></span> Submit Comments</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal.bind(this)}>
                    <ModalHeader toggle={this.toggleModal.bind(this)}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select model=".rating" className="form-control" name="rating" >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                            <Label htmlFor="author">Your Name</Label>
                            <Control.text className="form-control" model=".author" id="author" name="author" placeholder="Your Name" validators={{minLength: minLength(3), maxLength: maxLength(15)}}></Control.text>
                            <Errors className="text-danger" model=".author" show="touched" messages={{
                                minLength: "Must be greater than 2 characters",
                                maxLength: "Must be 15 characters or less"
                            }}></Errors>
                            <Label htmlFor="comment">Comment</Label>
                            <Control.textarea rows="6" className="form-control" model=".comment" id="comment" name="comment"></Control.textarea>
                            <Button type="submit" color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>

        );
    }
}

const DishDetail = ({ dish, isLoading, errMess, comments, addComment }) => {
    if(isLoading){
        return (
            <div className="container">
                <div className="row">
                    <Loading></Loading>
                </div>
            </div>
        )
    }else if(errMess){
        return (
            <div className="container">
                <div className="row">
                    <h4>{errMess}</h4>
                </div>
            </div>
        )
    }
    if (!dish) return (<div></div>);
    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{dish.name}</h3>
                    <hr />
                </div>
            </div>
            <div className="row">
                <RenderDish dish={dish} />
                <RenderComments comments={comments} addComment={addComment} dishId={dish.id}/>
            </div>
        </div>
    );
}



export default DishDetail;