$(function(){
    var offset = 100;
    var scale = 1;
    var orig_width = null;
    var img = $("<img>").attr('id', 'static').attr('src', 'sample.png').load(function(){ orig_width = $(this).width(); });
    var overlay = img.clone().attr('id', 'overlay').attr('draggable', false).css('left', offset);
    var marker = $("<div>").attr('id', 'marker').css('left', offset).text(offset + "px");
    
    $("#edit-area").append(img, overlay, marker);

    var load_image = function(url) {
        orig_width = null;
        scale = 1;
        offset = 100;
        img.add(overlay).attr('src', url);
        set_position();
    }

    var marker_update = function(){
        var str = offset + "px";
        var appx_scale = Math.round(scale*100);
        if (scale != 100)
            str += " @ " + appx_scale + "%";
        marker.text(str);
    }

    var set_position = function(delta) {
        offset = Math.min(img.width(), Math.max(0, offset + delta));
        overlay.add(marker).css('left', offset * scale);
        marker_update();
    }

    var set_scale = function(delta) {
        if (orig_width) {
            var imgs = $("#edit-area img");
            scale *= Math.pow(1.1, delta);
            imgs.width(orig_width * scale);
            set_position(0);
        }
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
        if (e.keyCode >= 37 && e.keyCode <= 40)
            e.preventDefault();

        var shamt = e.shiftKey ? 10 : 1;
        if (e.keyCode == 37)
            set_position(-shamt);
        else if (e.keyCode == 39)
            set_position(shamt);
        else if (e.keyCode == 38)
            set_scale(-1);
        else if (e.keyCode == 40)
            set_scale(+1);
    });

    // Dragging
    var start_x=null;
    $(overlay).mousedown(function(e){
        start_x = e.pageX;
    });
    $(document).mousemove(function(e){
        if (start_x != null) {
            set_position(e.pageX - start_x);
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

