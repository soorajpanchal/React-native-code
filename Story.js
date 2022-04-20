import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import fonts from '../assets/fonts';
import { hs, vs } from '../utils/styleUtils';
import Container from './Container';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Label from './Label';
import { useNavigation } from '@react-navigation/native';
import Img from './Img';
import { DarkBlueColor, PrimaryColor } from '../assets/colors';
import { imageBaseUrl } from '../utils/apiEndPoints';
import useShare from '../hooks/useShare';
import { likeStoryApi } from '../features/app/storySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppImages } from '../assets/images';
import moment from 'moment';

const Story = ({
    id, image, description,
    userdetails,
    tag,
    flag_count,
    likes_count,
    comments_count,
    userid,
    created_at,
    exp_id
}) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [showMore, setShowMore] = useState(false);
    const [shareHandler] = useShare();
    const [likeStatus, setLikeStatus] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    const { data: userData } = useSelector((state) => state.user);
    const { data: likeStory } = useSelector((state) => state.story.likeStory);
    const comments = useSelector((state) => state.story.comments);

    useEffect(() => {
        setLikeCount(likes_count);
        setLikeStatus(flag_count == 1);
        setCommentCount(comments_count);
    }, [likes_count, comments_count, flag_count]);

    useEffect(() => {
        if (likeStory?.story_id === id) {
            console.log('likeStory', likeStory)
            setLikeCount(likeStory?.like_count);
            setLikeStatus(likeStory?.like_status);
        }
    }, [likeStory]);

    useEffect(() => {
        if (comments?.story_id === id) {
            setCommentCount(comments?.count);
        }
    }, [comments]);

    const shareStory = () => {
        shareHandler({
            link: `https://turn?story_id=${id}`,
            title: 'Turn App',
            message: description,
            image: `${imageBaseUrl}${image}`
        });
    };

    const likeHandler = () => {
        let formData = new FormData();
        formData.append('story_id', id);
        formData.append('user_id', userData?.id);
        formData.append('notifytime', moment().format('YYYY-MM-DD HH:mm:ss'));
        dispatch(likeStoryApi(formData));
    };

    const goToComment = () => {
        navigation.navigate('StoryComments', {
            story_id: id,
            story_user_id: userid,
            comment_count: commentCount
        });
    };


    const goToUserDetail = () => {
        if (userid == userData?.id) {
            navigation.navigate('Profile');
        } else {
            navigation.navigate('OtherProfile', {
                user_id: userid
            });
        }

    };

    return (
        <View style={{ flex: 1 }} >
            <Container
                containerStyle={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                height={55}
                mpContainer={{ ph: 10 }}
                onPress={goToUserDetail}
            >
                {
                    !userdetails?.photo ?
                        <Img
                            imgSrc={AppImages.profile}
                            imgStyle={{
                                borderRadius: 40,
                            }}
                            width={40} height={40}
                        />
                        :
                        <Img
                            imgSrc={{ uri: `${imageBaseUrl}${userdetails?.photo}` }}
                            imgStyle={{
                                width: hs(40),
                                height: vs(40),
                                borderRadius: 20,
                                backgroundColor: '#f2f2f2',
                            }}
                        />
                }
                <Container mpContainer={{ mh: 10, mt: 5 }} >
                    <Label style={{
                        color: 'black',
                    }}
                        labelSize={14}
                    >{userdetails?.name}</Label>
                    <Label style={{
                        color: 'grey',
                        top: -4
                    }}
                        labelSize={12}
                    >{moment(created_at).calendar()}</Label>
                </Container>
            </Container>
            <Container containerStyle={{ backgroundColor: '#f2f2f2' }} height={1} />
            <Img
                imgSrc={{ uri: `${imageBaseUrl}${image}` }}
                imgStyle={{
                    width: '100%',
                    justifyContent: 'flex-end',
                }}
                height={250}
            />
            <Container containerStyle={{
                backgroundColor: 'white',
                justifyContent: 'center'
            }}
                height={45}
                mpContainer={{ mh: 10 }}
            >
                <Container containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }} >
                    <Ionicons
                        name={likeStatus ? 'ios-heart' : 'ios-heart-outline'}
                        size={30}
                        color={likeStatus ? PrimaryColor : 'black'}
                        onPress={likeHandler}
                    />
                    <Feather
                        name='message-circle'
                        size={28}
                        color='black'
                        style={{
                            marginHorizontal: 10
                        }}
                        onPress={goToComment}
                    />
                    <Ionicons
                        name='md-share-social'
                        size={25}
                        color='black'
                        onPress={shareStory}
                    />
                </Container>
                <Container containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 0,
                    display: exp_id ? 'flex' : 'none'
                }}
                    onPress={() => {
                        navigation.navigate("ExperienceDetail", { experience_id: exp_id })
                    }}
                >
                    <Label
                        labelSize={14}
                        style={{ fontFamily: fonts.medium }}
                    >Linked experience</Label>
                    <Ionicons
                        name='ios-chevron-forward'
                        size={22}
                        color={DarkBlueColor}
                    />
                </Container>
            </Container>
            <Container
                mpContainer={{ mh: 15 }}
                style={{ flex: 1 }}
            >
                <Label
                    labelSize={14}
                    textColor='black'
                    style={{ fontFamily: fonts.medium }}
                >{userdetails?.name} <Label
                    labelSize={14}
                    style={{ fontFamily: fonts.regular }}
                >{description.length > 50 && !showMore ? `${description?.slice(0, 50)}.. ` : `${description}`}
                        {
                            description.length > 50 && <Label style={{
                                color: "grey",
                                fontFamily: fonts.semiBold
                            }}
                                labelSize={14}
                                mpLabel={{ mr: 15 }}
                                onPress={() => {
                                    setShowMore((prev) => !prev);
                                }}
                            >{showMore ? '.. less' : 'more'}</Label>
                        }
                    </Label>
                </Label>
                {
                    tag?.length ?
                        <Container containerStyle={{
                            flexDirection: 'row',
                            flex: 1,
                            flexWrap: 'wrap',
                        }}
                        >
                            {tag.map((item, index) => {
                                return (
                                    <Label
                                        labelSize={12}
                                        textColor='#117cba'
                                        mpLabel={{ mh: 2 }}
                                        key={index.toString()}
                                    >{item}</Label>
                                );
                            })}
                        </Container>
                        : null
                }
            </Container>
            <Container containerStyle={{ flexDirection: 'row', alignItems: 'center' }} mpContainer={{ mv: 5, mh: 15 }} >
                {
                    likeCount ?
                        <Label
                            labelSize={14}
                            textColor='grey'
                        >{likeCount} {likeCount == 1 ? 'like' : 'likes'}</Label> : null
                }
                {
                    commentCount ?
                        <Label
                            labelSize={14}
                            textColor='grey'
                            mpLabel={{ mh: 5 }}
                        >{commentCount} {commentCount == 1 ? 'comment' : 'comments'}</Label> : null
                }
            </Container>
        </View >
    );
};
export default Story;
