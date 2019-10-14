<script>
  export let i = 0;
  export let attach = {};
  //console.log(attach);
</script>

<div class="card border-secondary p-0 m-0 ">

  <div
    class="card-header d-flex justify-content-between bd-highlight py-0 my-0">
    <div class="p-0 bd-highlight ">
      [{i + 1}]
      <a href={attach.url} target="_blank">{attach.type}</a>
    </div>

    <div class="p-0 bd-highlight pl-4">{attach.date}</div>
  </div>

  <div class="card-body py-0 my-0">
    {#if attach.title}
      <p class="card-text py-0 my-0">
        <b>{attach.title}</b>
      </p>
    {/if}
    {#if attach.img}
      <a href={attach.url} target="_blank">
        <img src={attach.img} alt={attach.type} style="max-width:200px;" />
      </a>
    {/if}
    {#if attach.description}
      <p class="card-text py-0 my-0">{attach.description}</p>
    {/if}
  </div>
</div>

<!---
	{
		"type": "video",
		"video": {
			"access_key": "a30b9d8dc751e604be",
			"can_add": 1,
			"can_edit": 1,
			"comments": 0,
			"date": 1571071585,
			"description": "Москва. Кремль. Путин. От 13.10.2019\nПодпишитесь на канал: https://www.youtube.com/c/poedinoktv?sub_confirmation=1\n\nОфициальный канал ток-шоу на об...",
			"duration": 1944,
			"id": 456240507,
			"local_views": 0,
			"owner_id": 43600517,
			"photo_130": "https://sun9-33.userapi.com/c851432/v851432301/1e8c78/MwrKKV9NJ_k.jpg",
			"photo_320": "https://sun9-68.userapi.com/c851432/v851432301/1e8c7a/jmwKCbFgF2g.jpg",
			"photo_640": "https://sun9-49.userapi.com/c851432/v851432301/1e8c7b/BOjGNvfxxIo.jpg",
			"photo_800": "https://sun9-49.userapi.com/c851432/v851432301/1e8c7b/BOjGNvfxxIo.jpg",
			"platform": "YouTube",
			"title": "Москва. Кремль. Путин. От 13.10.19",
			"track_code": "video_78e8fc3fQWG0waUSNInaF5SX_Lcz66KlyK9ETmN2WZAsgvRvdAVwRLXykyIEvA",
			"views": 1
		}
	}

	{
		"photo": {
			"access_key": "92895473125addc2b1",
			"album_id": -7,
			"date": 1571067998,
			"height": 881,
			"id": 457253313,
			"owner_id": -130346581,
			"photo_1280": "https://sun9-13.userapi.com/c857232/v857232279/97a5/dPuJqNZGaSo.jpg",
			"photo_130": "https://sun9-14.userapi.com/c857232/v857232279/97a2/ieoGhBtZyoA.jpg",
			"photo_604": "https://sun9-32.userapi.com/c857232/v857232279/97a3/XyCXD0cPt2Q.jpg",
			"photo_75": "https://sun9-59.userapi.com/c857232/v857232279/97a1/nUkcyUdQAA8.jpg",
			"photo_807": "https://sun9-23.userapi.com/c857232/v857232279/97a4/WgtYH5sHmUc.jpg",
			"post_id": 44627,
			"text": "",
			"user_id": 100,
			"width": 1035
		},
		"type": "photo"
	}

-->
