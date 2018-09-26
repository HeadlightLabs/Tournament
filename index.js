const Robot = require('./Robot');

const robot = new Robot();

const main = async () => {
    await robot.register();
    clear = setInterval(search, 100);
}

const search = async () => {
    let nodes = await robot.scan()

    nodes = nodes.sort((node1, node2) => {
        return node1.Value - node2.Value;
    }).filter(node => !node.Claimed).filter(node => node.Value > 0);

    while (nodes.length) {
        if (nodes.length) {
            node = nodes[nodes.length - 1];
            await robot.claim(node.Id);
            await robot.mine(node.Id);
            await robot.release(node.Id);
            nodes.pop();
            return;
        }
    }
    console.log("SCORE", robot.score);
    await robot.move();
}

main();