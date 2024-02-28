import { useEffect, useState } from 'react';
import './style.css';
import { Rate, Tabs } from 'antd';
import { LikeOutlined, DislikeOutlined, SendOutlined } from '@ant-design/icons';
import Button from 'components/Button';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { commentProduct, getCommentsOfProduct, getProduct, ratingProduct } from 'pages/Home/productSlice';
import { Link, useNavigate } from 'react-router-dom';

interface IProps {
    handleClickAddToCart: Function;
}
const DetailFood = ({ handleClickAddToCart }: IProps) => {

    // Store
    const dispatch = useAppDispatch();
    const { product, comments } = useAppSelector(state => state.productStore);
    const { userInfo } = useAppSelector(state => state.authStore);
    const [currentImageDetail, setCurrentImageDetail] = useState('');

    // useState
    const [valueStar, setValueStar] = useState(product.totalRating / 5);
    const [textComment, setTextComment] = useState('')
    const [activeTab, setActiveTab] = useState('1');

    // useNavigate
    const navigate = useNavigate()

    // Function
    const changeTab = (activekey: string) => {
        setActiveTab(activekey);
    };

    const handleChangeRating = async (value: number) => {
        await dispatch(ratingProduct({ productId: product.productId, star: value }));
        setValueStar(value);
        await dispatch(getProduct(product.productId))
    };

    const handleSendComment = async()=>{
        await dispatch(commentProduct({ productId: product.productId, text: textComment }))
        setTextComment('')
        await dispatch(getCommentsOfProduct(product.productId))
    }
    const directToDiscover = (tag: string) => {
        navigate(`/product?tag=${tag}`)
    }

    // useEffect
    useEffect(() => {
        setCurrentImageDetail(product.image);
    }, [product.productId]);

    useEffect(() => {
        if (userInfo.userId) {
            const existRating = product.ratings ? product.ratings?.findIndex(rating => rating.userId === userInfo.userId) : -1;
            if (existRating >= 0 && product.ratings) {
                setValueStar(product.ratings[existRating].star);
            }
        }
    }, [userInfo.userId]);

    return (
        <div className='detail-food'>
            <div className="detail-food-info">
                <div className="detail-food-images">
                    <div className="display-detail-food">
                        <img src={currentImageDetail ? currentImageDetail : product.image} alt='food' className="display-image-detail"></img>
                    </div>
                </div>
                <div className="detail-food-info-content">
                    <div className="detail-food-info-name">{product.name}</div>
                    <div className="detail-food-stars">
                        <Rate onChange={(value) => handleChangeRating(value)} className="detail-food-star" allowHalf value={valueStar} />
                        <div className="number-rate">({(product.totalRating / 5) * 5}) - {product?.ratings?.length} Người đánh giá</div>
                    </div>
                    <div className="detail-food-description">{product.description}</div>
                    <div className="detail-food-category">
                        <div className="food-category" onClick={() => directToDiscover(product.tags)}>{product.tags}</div>
                    </div>
                    <div className="detail-food-price">
                        <span className='text-price'>Giá:</span>
                        <span className='text-number-price'>{' ' + product.price}</span>
                    </div>
                    <div className="btn-add-to-cart">
                        <Button handleClick={() => handleClickAddToCart(product)}>Thêm vào giỏ hàng</Button>
                    </div>
                </div>
            </div>
            <div className="detail-food-review-comment">
                <div className="tabs-detail-food">
                    <div className="tab-detail-header">
                        <div className="tab-options">
                            <div className={"option " + (activeTab === '1' ? ' active' : '')} onClick={() => changeTab('1')}>Bình luận</div>
                            <div className={"option " + (activeTab === '2' ? ' active' : '')} onClick={() => changeTab('2')}>Đánh giá</div>
                        </div>
                    </div>
                    <div className="tab-detail-content">
                        {
                            activeTab === '2' ? <div className="tab-customer-reviews">
                                <div className="customer-review">
                                    <div className="customer-review-avatar">
                                        <img src="https://i.pinimg.com/236x/ff/51/14/ff511414a601200fb839106327e84e39.jpg" alt="customer" />
                                    </div>
                                    <div className="customer-review-content-review">
                                        <div className="customer-review-name">Cuong Nguyen</div>
                                        <div className="text-review">Chat luong do an tot</div>
                                    </div>
                                </div>
                                <div className="customer-review">
                                    <div className="customer-review-avatar">
                                        <img src="https://i.pinimg.com/236x/ff/51/14/ff511414a601200fb839106327e84e39.jpg" alt="customer" />
                                    </div>
                                    <div className="customer-review-content-review">
                                        <div className="customer-review-name">Cuong Nguyen</div>
                                        <div className="text-review">Chat luong do an tot</div>
                                    </div>
                                </div>
                                <div className="customer-review">
                                    <div className="customer-review-avatar">
                                        <img src="https://i.pinimg.com/236x/ff/51/14/ff511414a601200fb839106327e84e39.jpg" alt="customer" />
                                    </div>
                                    <div className="customer-review-content-review">
                                        <div className="customer-review-name">Cuong Nguyen</div>
                                        <div className="text-review">Chat luong do an tot</div>
                                    </div>
                                </div>
                            </div>
                                :
                                <div className="tab-comments">
                                    {
                                        (comments && comments.length > 0) ? 
                                       comments.map(comment => {
                                        return(
                                            <div className="comment" key={comment.commentId}>
                                                <div className="user-avatar">
                                                    <img src={comment.user.avatar} alt="customer" />
                                                </div>
                                                <div className="user-comment-content">
                                                    <div className="user-comment-name">{comment.user.username}</div>
                                                    <div className="content-comment">{comment.text}</div>
                                                    <div className="action-with-comment">
                                                        <LikeOutlined className='icon active' />
                                                        <DislikeOutlined className='icon' />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                       })
                                       : 
                                       <div className='no-comment'>Không có bình luận nào</div>
                                    }
                                    
                                </div>
                        }
                        {
                            activeTab === '1' ?
                                <div className='wrap-input-comment'>
                                    {
                                        userInfo.userId ? 
                                            <div className='wrap-input-icon'>
                                                <input className='input-comment' type='text' placeholder='type...' value={textComment} onChange={(e) => setTextComment(e.target.value)} />
                                                <SendOutlined onClick={() => handleSendComment()} className={'icon-send-comment ' + (textComment.length > 0 ? '' : 'disable')} />
                                            </div>
                                            :
                                            <div style={{backgroundColor: '#fff'}}>
                                                Đăng nhập để bình luận
                                                <Link to={'/auth/login'} style={{marginLeft: '5px'}}>Đăng nhập</Link>
                                            </div>
                                    }
                                   
                                </div> 
                                : ''
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};
export default DetailFood;