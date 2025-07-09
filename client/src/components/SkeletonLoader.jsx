import { List, Skeleton } from "antd";

function SkeletonLoader() {
    return (
        <List
            dataSource = {[{},{},{},{},{}]}
            renderItem = {i => (
                <List.Item>
                    <Skeleton title={false} loading={true} active>
                        <List.Item.Meta
                            title       = {<span>asdasiudsdaads</span>}
                            description = "Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </Skeleton>
                </List.Item>
            )}
        />
    );
}

export default SkeletonLoader;