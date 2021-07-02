javascript: (function () {

  function copyToClipBoard() {
    var copyText = $j("iframe[name=gsft_main]")
      .contents()
      .find("#single-input-journal-entry .sn-stream-textarea-container #activity-stream-textarea")[0];
    
    copyText.select();
    document.execCommand("copy");
    
    return false;
  }

  function isAlreadyBetweenCode(allText, textStart) {
    var textBeforeSelText = allText.substring(0, textStart);
    var matches = textBeforeSelText.match(/\[code\]|\[\/code\]/gmi);
    
    if (matches == null) 
      return false;
    
    var lastMatch = matches[matches.length - 1];
    
    return (lastMatch === "[code]")
  }

  function replaceSelection(event) {
    var openingTag = event.data.oTag;
    var closingTag = event.data.cTag;

    var textArea = $j("iframe[name=gsft_main]")
      .contents()
      .find("#single-input-journal-entry .sn-stream-textarea-container #activity-stream-textarea");

    var textStart = textArea.prop('selectionStart');
    var textFinish = textArea.prop('selectionEnd');

    var allText = textArea.val();

    var selelectedText = allText.substring(textStart, textFinish);

    var newText = "Error within replaceSelection function";

    var openTag = openingTag;
    var closeTag = closingTag;

    if (!isAlreadyBetweenCode(allText, textStart)) {
      openTag = "[code]" + openingTag;
      closeTag = closingTag + "[/code]";
    }

    switch (openingTag) {
      case "<pre><code>":
      case "<blockquote>":
        selelectedText = selelectedText
          .split(/\n|\s\n/)
          .join("<br>\n");
        
        newText = allText
          .substring(0, textStart) + 
          openTag + 
          selelectedText + 
          closeTag + 
          allText.substring(textFinish, allText.length);
        
        break;

      case "<ul>":
      case "<ol>":
        selelectedText = selelectedText
          .split(/\s*\n/gm)
          .join("</li><li>");
        
        newText = allText
          .substring(0, textStart) + 
          openTag + "<li>" + 
          selelectedText + 
          closeTag + 
          allText.substring(textFinish, allText.length);
        
        break;

      case "<h":
        var headingSize = prompt("Please introduce size of the heading (1-6)", "1");
        
        if (headingSize == '') 
          headingSize = 3;

        newText = allText
          .substring(0, textStart) + 
          openTag + 
          headingSize + ">" + 
          selelectedText + "</h" + 
          headingSize + 
          closeTag + 
          allText.substring(textFinish, allText.length);
        
        break;

      case '<a href="':
        var urlName = prompt("Please introduce the name/title of the URL", selelectedText);
        
        if (urlName == '')
          urlName = selelectedText;
        
        newText = allText
          .substring(0, textStart) + 
          openTag + 
          selelectedText + '" target="_blank" >' + 
          urlName + 
          closeTag + 
          allText.substring(textFinish, allText.length);
        
        break;

      default:
        newText = allText
          .substring(0, textStart) + 
          openTag + 
          selelectedText + 
          closeTag + 
          allText.substring(textFinish, allText.length);
    }

    textArea.val(newText);
    var event = new Event('change');
    textArea[0].dispatchEvent(event);

    return false;
  }

  function enablePreview(isAnUpdate = false) {

    var iframe = $j("iframe[name=gsft_main]").contents();
    var previewElement = iframe.find("#my-comments-preview blockquote");
    var previewIsAlreadyEnabled = previewElement.length;

    if (previewIsAlreadyEnabled > 0 && isAnUpdate != true) {
      iframe.find("#my-comments-preview").remove();

    } else if (previewIsAlreadyEnabled > 0 && isAnUpdate == true) {
      var textArea = iframe.find("#single-input-journal-entry .sn-stream-textarea-container #activity-stream-textarea");
      var allText = textArea
        .val()
        .replace(/\[code\]|\[\/code\]/gmi, '')
        .replace(/\r?\n/gmi, '<br/>');
      
      previewElement.html(allText);

    } else {
      var commentsNotesTextArea = iframe.find("#single-input-journal-entry .form-field");

      var textArea = iframe.find("#single-input-journal-entry .sn-stream-textarea-container #activity-stream-textarea");
      var allText = textArea
        .val()
        .replace(/\[code\]|\[\/code\]/gmi, '')
        .replace(/\r?\n/gmi, '<br/>');

      commentsNotesTextArea.prepend('<div id="my-comments-preview"><blockquote>' + allText + '</blockquote></div>');
    }

    return false;
  }

  function removeButtons() {
    // TODO
  }

  function createButtons(buttonsArray) {
    var commentsNotesTextArea = $j("iframe[name=gsft_main]")
      .contents()
      .find("#single-input-journal-entry .form-field");

    var button;

    for (var i = 0; i < buttonsArray.length; i++) {
      var openingTag = buttonsArray[i].openingTag;
      var closingTag = buttonsArray[i].closingTag;

      button = $j('<button/>', {
        title: buttonsArray[i].title,
        class: buttonsArray[i].class,
        id: "button-" + buttonsArray[i].class
      });

      switch (openingTag) {
        case 'copy':
          button.click(copyToClipBoard);
          break;

        case 'preview':
          button.click(enablePreview);
          break;

        case 'removebuttons':
          button.click(function () { 
            $j("iframe[name=gsft_main]")
              .contents()
              .find('#single-input-journal-entry .form-field div#my-comments-preview')
              .remove(); 
              
            $j("iframe[name=gsft_main]")
              .contents()
              .find('#single-input-journal-entry .form-field button[id^="button-icon-"]')
              .remove(); 
              
            return false; 
          });

          break;

        default:
          button.click({ oTag: openingTag, cTag: closingTag }, replaceSelection);
      }

      commentsNotesTextArea.prepend(button);
    }
  }

  var buttonsArray = [
    {
      openingTag: 'removebuttons',
      closingTag: 'removebuttons',
      title: 'Remove editor buttons',
      class: 'icon-cross'
    },
    {
      openingTag: 'copy',
      closingTag: 'copy',
      title: 'Copy to clipboard',
      class: 'icon-copy'
    },
    {
      openingTag: 'preview',
      closingTag: 'preview',
      title: 'Enable Preview',
      class: 'icon-preview'
    },
    {
      openingTag: '<h',
      closingTag: '>',
      title: 'Title/Heading',
      class: 'icon-text'
    },
    {
      openingTag: '<ol>',
      closingTag: '</ol>',
      title: 'Numbered list',
      class: 'icon-radio-numeric-scale'
    },
    {
      openingTag: '<ul>',
      closingTag: '</ul>',
      title: 'Bullet Points',
      class: 'icon-list'
    },
    {
      openingTag: '<blockquote>',
      closingTag: '</blockquote>',
      title: 'Blockquote',
      class: 'icon-blog'
    },
    {
      openingTag: '<pre><code>',
      closingTag: '</code></pre>',
      title: 'Code (Block)',
      class: 'icon-document-code'
    },
    {
      openingTag: '<code>',
      closingTag: '</code>',
      title: 'Code (Inline)',
      class: 'icon-code'
    },
    {
      openingTag: '<a href="',
      closingTag: '</a>',
      title: 'Hyperlink',
      class: 'icon-link'
    },
    {
      openingTag: '<strike>',
      closingTag: '</strike>',
      title: 'Strikethrough Text',
      class: 'icon-remove'
    },
    {
      openingTag: '<em>',
      closingTag: '</em>',
      title: 'Italic Text',
      class: 'icon-text-italic'
    },
    {
      openingTag: '<b>',
      closingTag: '</b>',
      title: 'Bold Text',
      class: 'icon-text-bold'
    }
  ];

  createButtons(buttonsArray);

  $j("iframe[name=gsft_main]")
    .contents()
    .find("#single-input-journal-entry .sn-stream-textarea-container #activity-stream-textarea")
    .bind("keyup change", function () {
      var iframe = $j("iframe[name=gsft_main]").contents();
      var previewElement = iframe.find("#my-comments-preview");
      var previewIsAlreadyEnabled = previewElement.length;

      if (previewIsAlreadyEnabled > 0)
        enablePreview(true);
  });

})();