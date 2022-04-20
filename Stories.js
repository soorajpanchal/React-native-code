import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from 'react-native';
import styles from "./styles";
import Story from "../../../components/Story";
import { useDispatch, useSelector } from "react-redux";
import { storyListApi } from "../../../features/app/storySlice";
import MainContainer from "../../../components/MainContainer";
import Container from "../../../components/Container";
import { PrimaryColor } from "../../../assets/colors";

const Stories = ({ navigation }) => {
    const { data: storyList, loading, isMoreData, fetching } = useSelector((state) => state.story.storyList);
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        loadMoreData(1)
    }, []);

    const fetchingData = () => {
        let formData = new FormData()
        formData.append('limit', 2)
        formData.append('page', 1)
        setPage(1)
        dispatch(storyListApi({ data: formData, isFetching: true }));
    }

    const loadMoreData = (page) => {
        let formData = new FormData()
        formData.append('limit', 2)
        formData.append('page', page)
        // setPage(1)
        dispatch(storyListApi({ data: formData, isMoreLoading: page > 1 ? true : false }))
    }

    return (
        <MainContainer
            style={styles.maincontainer}
            loading={loading}
        >
            <FlatList
                data={storyList}
                renderItem={({ item, index }) => {
                    return <Story
                        key={index}
                        {...item}
                        tag={item.tag ? JSON.parse(item.tag) : []}
                    />;
                }}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={() => <Container mpContainer={{ mt: 5 }} />}
                refreshing={fetching}
                onRefresh={() => {
                    // dispatch( removeCacheLiked() );
                    fetchingData()
                }}
                onEndReached={() => {
                    if (isMoreData) {
                        setPage((prev) => prev + 1)
                        loadMoreData(page + 1)
                    }
                }}
                ListFooterComponent={() => {
                    return <ActivityIndicator
                        animating={isMoreData}
                        size={30}
                        color={PrimaryColor}
                        style={{ marginVertical: 10 }}
                    />
                }}
            />
        </MainContainer>
    );
};
export default Stories;
