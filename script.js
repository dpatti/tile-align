$(function(){
    var offset = 100;
    var img = $("<img>").attr('id', 'static').attr('src', 'sample.png');
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

    // Interface
    $("#url").keydown(function(e){
        if (e.keyCode == 13) {
            load_image($(this).val());
        }
    });
    $("#load").click(function(){
        load_image($(this).prev().val());
    });
    
    // Key
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

    // Dragging
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

    // Lights
    $(document).on('click', "a.lights", function(){
        $("body").css({
            backgroundColor: $(this).is(".off") ? '#000' : '#fff',
            color:           $(this).is(".off") ? '#fff' : '#000',
        });
        var other = $("span.lights");
        other.replaceWith($("<a>").text(other.text()).addClass(other.attr('class')).attr('href', 'javascript:;'));
        $(this).replaceWith($("<span>").text($(this).text()).addClass($(this).attr('class')));
    });
});

