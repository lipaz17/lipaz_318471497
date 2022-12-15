var showname = new URL(location.href).searchParams.get('show');
var title_html = document.querySelector("#title");
var avg_review_html = document.querySelector("#avg-review");


if (title_html) {
    title_html.innerHTML = db["reviews"][showname].name;
}


var reviews = db["reviews"][showname]["reviews"];
let list = document.getElementById("review-list");
reviews.forEach((review) => {
    let li = document.createElement("div");
    li.innerHTML = createReviewLiObject(review);
    list.appendChild(li);
})
avg_review_html.innerHTML = calcAvgReview(reviews);

function createReviewLiObject(review) {

    const base_html = `
    <div>
        <div class="review-grid ">
            <div class="review-rating">
                ${review.rating}
            </div>
            <div class="review-header">
                ${review.title}
            </div>
            <div>
            </div>
            <div class="review-grid-item">
                ${review.description}
            </div>
        </div>
    </div><br/>`
    return base_html;
}

function calcAvgReview(reviews) {
    if (reviews.length == 0) {
        return -1;
    }
    var sum = 0;
    reviews.forEach((review) => {
        sum += review.rating;
    })
    return (sum / reviews.length).toFixed(2);
}