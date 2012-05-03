$(function(){
    var offset = 100;
    var img = $("<img>").attr('id', 'static').attr('src', 'http://screens.nca-guild.com/uploads/1074.png');
    var overlay = img.clone().attr('id', 'overlay').attr('draggable', false).css('left', offset);
    var marker = $("<div>").attr('id', 'marker').css('left', offset).text(offset);
    
    $("#edit-area").append(img, overlay, marker);

    var load_image = function(url) {
        img.add(overlay).attr('src', url);
    }

    var position = function(delta) {
        offset = Math.min(img.width(), Math.max(0, offset + delta));
        overlay.add(marker).css('left', offset);
        marker.text(offset);
    }
    
    $(document).keydown(function(e){
        var shamt = e.shiftKey ? 10 : 1;
        if (e.keyCode == 37) {
            position(-shamt);
            e.preventDefault();
        } else if (e.keyCode == 39) {
            position(shamt);
            e.preventDefault();
        }
    });

    $("#url").keydown(function(e){
        if (e.keyCode == 13) {
            load_image($(this).val());
        }
    });
    $("#load").click(function(){
        load_image($(this).prev().val());
    });

    var start_x=null;
    $(overlay).mousedown(function(e){
        start_x = e.pageX;
    });
    $(document).mousemove(function(e){
        if (start_x != null) {
            position(e.pageX - start_x);
            console.log(e.pageX - start_x);
            start_x = e.pageX;
        }
    }).mouseup(function(){
        start_x = null;
    })
});

