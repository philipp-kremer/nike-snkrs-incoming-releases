function colorConfig() {
    const tintLogo = false;
    const tintColor = new Color('#FC6D26');

    // light mode
    const lightBackgroud = new Color('#FFFFFF');
    const lightHeader = new Color('');
    const lightText = new Color('#000000');
    const lightHeaderText = new Color('#ff0017');

    return {
        bgColor: lightBackgroud,
        bgHeaderColor: lightHeader,
        textColor: lightText,
        headerTextColor: lightHeaderText,
        tintColor: tintColor,
        tintLogo: tintLogo,
    };
}

const widget = new ListWidget();

if (config.runsInWidget) {
    if (config.widgetFamily == 'small') {
        onWidget = await createSmallWidget();
    } else {
        onWidget = await createLargeWidget();
    }
    Script.setWidget(onWidget);
} else {
    onWidget = await createSmallWidget();
    onWidget.presentSmall();
    onWidget = await createLargeWidget();
    onWidget.presentMedium();
    onWidget = await createLargeWidget();
    onWidget.presentLarge();
}

async function createWidgetHeader(widget) {
    const colors = colorConfig();
    const nikeSnkrsLogo = await getImage('nike-snkrs');

    const header = widget.addStack();

    const text = header.addText('Releases');
    text.font = Font.boldSystemFont(16);
    text.textColor = colors.headerTextColor;

    header.addSpacer();
    const logoImage = header.addImage(nikeSnkrsLogo);
    logoImage.imageSize = new Size(20, 20);
}

/**
 * Creates small sized widget.
 *
 * @return {ListWidget}
 */
async function createSmallWidget() {
    // Initialize widget
    const colors = colorConfig();

    const data = await fetchData();

    const request = new Request(data.publishedContent.properties.coverCard.properties.portraitURL);
    result = await request.loadImage();

    widget.backgroundImage = result;

    await createWidgetHeader(widget);

    widget.addSpacer();

    addInformation(data, widget);

    return widget;
}

/**
 * Creates large sized widget.
 *
 * @return {ListWidget}
 */
async function createLargeWidget() {
    // Initialize widget
    const colors = colorConfig();

    widget.backgroundColor = colors.bgColor;

    await createWidgetHeader(widget);

    widget.addSpacer();

    await addDefaultWidgetData(widget);

    return widget;
}

/**
 *
 * @params {ListWidget} widget
 */
async function addDefaultWidgetData(widget) {
    const colors = colorConfig();
    const upperTextStack = widget.addStack();

    const data = await fetchData();

    data.objects.forEach(result => addInformation(result, widget));
}

async function addInformation(data, widget) {
    const colors = colorConfig();

    const title = data.publishedContent.properties.coverCard.properties.title;
    const subTitle = data.publishedContent.properties.coverCard.properties.subtitle;

    const date = new Date(data.productInfo[0].launchView.startEntryDate);
    const formatted = date.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short'
    }).replace(/ /g, ' ');

    textStack = widget.addStack();
    textStack.layoutVertically();

    const releaseDate = textStack.addText(`🗓 ${formatted}`);
    releaseDate.font = Font.lightSystemFont(8);
    releaseDate.textColor = colors.textColor;

    const titleText = textStack.addText(title);
    titleText.font = Font.boldSystemFont(12);
    titleText.textColor = colors.textColor;

    const subTitleText = textStack.addText(subTitle);
    subTitleText.font = Font.lightSystemFont(8);
    subTitleText.textColor = colors.textColor;

    textStack.addSpacer();
}

async function fetchData() {
    const url = 'https://api.nike.com/product_feed/threads/v2?filter=marketplace%28DE%29&filter=language%28de%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&anchor= 3&count=3&sort=effectiveStartSellDateAsc&fields=productInfo.launchView.startEntryDate%2CpublishedContent.properties.coverCard.properties.title%2CpublishedContent.properties.coverCard.properties.subtitle%2CpublishedContent.properties.coverCard.properties.portraitURL';
    const request = new Request(url);
    const randomNumber = Math.floor(Math.random() * 3);

    const response = await request.loadJSON();

    if (config.widgetFamily == 'small' || config.widgetFamily == 'null') {
        return response.objects[randomNumber];
    }

    return response;
}

async function getImage(name) {
    let data = '';
    let result;
    switch (name) {
        case 'nike-snkrs':
            data = 'https://www.theshitbot.com/wp-content/uploads/2021/06/snkrs.png';
            break;
        default:
            data = '';
            break;
    }

    const request = new Request(data);
    result = await request.loadImage();

    return result;
}