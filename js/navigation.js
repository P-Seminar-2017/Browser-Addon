class Navigation {

  static showAll(visible) {
    this.showHeadline(visible);
    this.showLoader(visible);
    this.showEdit(visible);
    this.showView(visible);
    this.showSubmit(visible);
    this.showChooseForm(visible);
  }

  static showMessage(msg) {
    if ($("#homework_edit").prop("display") != "none") {

      $("#submit-btn").animate({
        top: "-=30px",
      }, 5);

      Materialize.toast(msg, 2000, "", function() {
        $("#submit-btn").animate({
          top: "+=30px",
        }, 100);
      });

    } else {
      Materialize.toast(msg, 2000);
    }
  }

  static showHeadline(visible) {
    if (visible) {
      $("#headline").show();
    } else {
      $("#headline").hide();
    }
  }

  static showLoader(visible) {
    if (visible) {
      $("#loader").show();
    } else {
      $("#loader").hide();
    }
  }

  static showEdit(visible) {
    if (visible) {
      $("#homework_edit").show();
    } else {
      $("#homework_edit").hide();
    }
  }

  static showView(visible) {
    if (visible) {
      $("#homework_view").show();
    } else {
      $("#homework_view").hide();
    }
  }

  static showSubmit(visible) {
    if (visible) {
      $("#homework_submit").show();
    } else {
      $("#homework_submit").hide();
    }
  }

  static showChooseForm(visible) {
    if (visible) {
      $("#homework_choose_form").show();
    } else {
      $("#homework_choose_form").hide();
    }
  }

}
