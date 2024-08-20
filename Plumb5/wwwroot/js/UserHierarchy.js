$(document).ready(function () {
    GetUsersBySeniorIdForTree();
});

function GetUsersBySeniorIdForTree() {
    $.ajax({
        type: "POST",
        url: "/ManageUsers/Users/GetUsersBySeniorIdForTree",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            const hierarchyRoot = buildUserHierarchy(response);
            BindTree(hierarchyRoot.items);
        },
        error: ShowAjaxError
    });
}

class UserNode {
    constructor(id, name) {
        this.id = id != null ? id.toString() : null;
        this.text = name;
        this.expanded = true;
        this.items = [];
    }
}

function buildUserHierarchy(users) {
    const userMap = new Map();
    const root = new UserNode(null, "Users"); // Root node representing the whole company
    // Create nodes for each user and store them in a map for easy access

    users.forEach((user) => {
        const { UserInfoUserId, FirstName, SeniorUserId } = user;
        const newNode = new UserNode(UserInfoUserId, FirstName);
        userMap.set(UserInfoUserId, newNode);

        // If parent_id is null, it's the root node, otherwise add it as a child to its parent
        if (SeniorUserId == 0) {
            root.items.push(newNode);
        } else {
            const parentNode = userMap.get(SeniorUserId);
            if (parentNode) {
                parentNode.items.push(newNode);
            }
        }
    });

    return root;
}

function BindTree(data) {
    $("#simple-treeview")
        .dxTreeView({
            items: data,
            width: 220,
            onItemClick(e) {
                const item = e.itemData;
                CallBackWithUser(parseInt(item.id), item.text)//UserId,Name
            },
        })
        .dxTreeView("instance");
}