import React from "react";
import styles from "./WidgetCustomizer.module.css";

const WidgetCustomizer = ({ customSettings, onSettingsChange }) => {
  const {
    fontStyle,
    textAlign,
    border,
    borderColor,
    widthType = "responsive",
    widthPixels = 350,
    heightType = "posts",
    heightPixels = 400,
    heightPosts = 3,
    autoScroll = true,
  } = customSettings;
  const handleWidthTypeChange = (type) => {
    onSettingsChange({ ...customSettings, widthType: type });
  };
  const handleHeightTypeChange = (type) => {
    onSettingsChange({ ...customSettings, heightType: type });
  };
  const handleNumberChange = (field, value, min = 1, max = 597) => {
    const newValue = Math.max(min, Math.min(max, value));
    onSettingsChange({ ...customSettings, [field]: newValue });
  };
  const incrementValue = (field, current, step = 1, max = 597) => {
    handleNumberChange(field, current + step, 1, max);
  };

  const decrementValue = (field, current, step = 1, min = 1) => {
    handleNumberChange(field, current - step, min, 1000);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>General</h2>
        </div>
        {/* Width Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Width</h3>

          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="widthType"
                value="pixels"
                checked={widthType === "pixels"}
                onChange={() => handleWidthTypeChange("pixels")}
              />
              <span className={styles.radioText}>In Pixels</span>
              <span className={styles.helpIcon}>?</span>
            </label>

            {widthType === "pixels" && (
              <div className={styles.stepControl}>
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() =>
                    decrementValue("widthPixels", widthPixels, 10, 50)
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  value={widthPixels}
                  onChange={(e) =>
                    handleNumberChange(
                      "widthPixels",
                      Number.parseInt(e.target.value) || 350
                    )
                  }
                  className={styles.numberInput}
                  min="100"
                  max="1000"
                />
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() =>
                    incrementValue("widthPixels", widthPixels, 10, 570)
                  }
                >
                  +
                </button>
              </div>
            )}
          </div>

          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="widthType"
                value="responsive"
                checked={widthType === "responsive"}
                onChange={() => handleWidthTypeChange("responsive")}
              />
              <span className={styles.radioText}>
                Responsive (Mobile friendly)
              </span>
              <span className={styles.helpIcon}>?</span>
            </label>
          </div>
        </div>
        {/* Height Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Height</h3>

          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="heightType"
                value="pixels"
                checked={heightType === "pixels"}
                onChange={() => handleHeightTypeChange("pixels")}
              />
              <span className={styles.radioText}>In Pixels</span>
              <span className={styles.helpIcon}>?</span>
            </label>

            {heightType === "pixels" && (
              <div className={styles.stepControl}>
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() =>
                    decrementValue("heightPixels", heightPixels, 10, 100)
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  value={heightPixels}
                  onChange={(e) =>
                    handleNumberChange(
                      "heightPixels",
                      Number.parseInt(e.target.value) || 400
                    )
                  }
                  className={styles.numberInput}
                  min="100"
                  max="1000"
                />
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() =>
                    incrementValue("heightPixels", heightPixels, 10, 1000)
                  }
                >
                  +
                </button>
              </div>
            )}
          </div>

          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="heightType"
                value="posts"
                checked={heightType === "posts"}
                onChange={() => handleHeightTypeChange("posts")}
              />
              <span className={styles.radioText}>Posts</span>
              <span className={styles.helpIcon}>?</span>
            </label>

            {heightType === "posts" && (
              <div className={styles.stepControl}>
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() =>
                    decrementValue("heightPosts", heightPosts, 1, 1)
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  value={heightPosts}
                  onChange={(e) =>
                    handleNumberChange(
                      "heightPosts",
                      Number.parseInt(e.target.value) || 3,
                      1,
                      20
                    )
                  }
                  className={styles.numberInput}
                  min="1"
                  max="20"
                />
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() =>
                    incrementValue("heightPosts", heightPosts, 1, 20)
                  }
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Autoscroll Section */}
        <div className={styles.section}>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <span className={styles.toggleText}>Autoscroll</span>
              <div className={styles.switch}>
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) =>
                    onSettingsChange({
                      ...customSettings,
                      autoScroll: e.target.checked,
                    })
                  }
                  className={styles.switchInput}
                />
                <span className={styles.slider}></span>
              </div>
            </label>
          </div>
        </div>
        {/* Font Style Section */}
        <div className={styles.formGroup}>
          <label>Font Style</label>
          <select
            value={fontStyle}
            onChange={(e) =>
              onSettingsChange({ ...customSettings, fontStyle: e.target.value })
            }
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Text Alignment</label>
          <div className={styles.alignment}>
            {["left", "center", "right", "justify"].map((align) => (
              <button
                key={align}
                className={`${styles.alignButton} ${
                  textAlign === align ? styles.active : ""
                }`}
                onClick={() =>
                  onSettingsChange({ ...customSettings, textAlign: align })
                }
                type="button"
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={border}
              onChange={(e) =>
                onSettingsChange({
                  ...customSettings,
                  border: e.target.checked,
                })
              }
            />{" "}
            Add Border
          </label>
        </div>

        {border && (
          <div className={styles.formGroup}>
            <label>Border Color</label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) =>
                onSettingsChange({
                  ...customSettings,
                  borderColor: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Feed Title</h2>
        </div>
        <div className={styles.section}>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <span className={styles.toggleText}>Custom</span>
              <div className={styles.switch}>
                <input
                  type="checkbox"
                  checked={!!customSettings.useCustomTitle}
                  onChange={(e) =>
                    onSettingsChange({
                      ...customSettings,
                      useCustomTitle: e.target.checked,
                    })
                  }
                  className={styles.switchInput}
                />
                <span className={styles.slider}></span>
              </div>
            </label>
          </div>

          {customSettings.useCustomTitle && (
            <>
              <div className={styles.formGroup}>
                <label>Main Title</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={customSettings.mainTitle || ""}
                  onChange={(e) =>
                    onSettingsChange({
                      ...customSettings,
                      mainTitle: e.target.value,
                    })
                  }
                  placeholder="Enter custom title"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Font-size</label>
                <div className={styles.stepControl}>
                  <button
                    type="button"
                    className={styles.stepButton}
                    onClick={() =>
                      onSettingsChange({
                        ...customSettings,
                        titleFontSize: Math.max(
                          1,
                          (customSettings.titleFontSize || 16) - 1
                        ),
                      })
                    }
                  >
                    −
                  </button>
                  <span style={{ padding: "0 10px" }}>
                    {(customSettings.titleFontSize || 16) + "px"}
                  </span>
                  <button
                    type="button"
                    className={styles.stepButton}
                    onClick={() =>
                      onSettingsChange({
                        ...customSettings,
                        titleFontSize: Math.min(
                          60,
                          (customSettings.titleFontSize || 16) + 1
                        ),
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Bold</span>
                  <div className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={customSettings.titleBold || false}
                      onChange={(e) =>
                        onSettingsChange({
                          ...customSettings,
                          titleBold: e.target.checked,
                        })
                      }
                      className={styles.switchInput}
                    />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Background color</label>
                <input
                  type="color"
                  value={customSettings.titleBgColor || "#ffffff"}
                  onChange={(e) =>
                    onSettingsChange({
                      ...customSettings,
                      titleBgColor: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Font color</label>
                <input
                  type="color"
                  value={customSettings.titleFontColor || "#000000ff"}
                  onChange={(e) =>
                    onSettingsChange({
                      ...customSettings,
                      titleFontColor: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Feed Content</h2>
        </div>
        <div className={styles.section}>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <span className={styles.toggleText}>Custom Feed Content</span>
              <div className={styles.switch}>
                <input
                  type="checkbox"
                  checked={!!customSettings.useCustomContent}
                  onChange={(e) => {
                    const enabled = e.target.checked;

                    if (!enabled) {
                      onSettingsChange({
                        ...customSettings,
                        useCustomContent: false,
                        showFeedTitle: true,
                        showFeedDescription: true,
                        showFeedDate: true,
                        feedTitleBold: false,
                        feedDescriptionBold: false,
                        feedTitleFontColor: "#6d8cd1",
                        feedTitleFontSize: 16,
                      });
                    } else {
                      onSettingsChange({
                        ...customSettings,
                        useCustomContent: true,
                      });
                    }
                  }}
                  className={styles.switchInput}
                />
                <span className={styles.slider}></span>
              </div>
            </label>
          </div>

          {customSettings.useCustomContent && (
            <>
              {/* Show Feed Title */}
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Show Feed Title</span>
                  <div className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={!!customSettings.showFeedTitle}
                      onChange={(e) =>
                        onSettingsChange({
                          ...customSettings,
                          showFeedTitle: e.target.checked,
                        })
                      }
                      className={styles.switchInput}
                    />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>

              {customSettings.showFeedTitle && (
                <>
                  {/* Feed Title Font Size */}
                  <div className={styles.formGroup}>
                    <label>Feed Title Font Size</label>
                    <div className={styles.stepControl}>
                      <button
                        type="button"
                        className={styles.stepButton}
                        onClick={() =>
                          onSettingsChange({
                            ...customSettings,
                            feedTitleFontSize: Math.max(
                              10,
                              (customSettings.feedTitleFontSize || 16) - 1
                            ),
                          })
                        }
                      >
                        −
                      </button>
                      <span style={{ padding: "0 10px" }}>
                        {(customSettings.feedTitleFontSize || 16) + "px"}
                      </span>
                      <button
                        type="button"
                        className={styles.stepButton}
                        onClick={() =>
                          onSettingsChange({
                            ...customSettings,
                            feedTitleFontSize: Math.min(
                              60,
                              (customSettings.feedTitleFontSize || 16) + 1
                            ),
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Feed Title Font Color */}
                  <div className={styles.formGroup}>
                    <label>Feed Title Font Color</label>
                    <input
                      type="color"
                      value={customSettings.feedTitleFontColor || "#000000"}
                      onChange={(e) =>
                        onSettingsChange({
                          ...customSettings,
                          feedTitleFontColor: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Feed Content Background Color */}
                  <div className={styles.formGroup}>
                    <label>Background</label>
                    <input
                      type="color"
                      value={customSettings.backgroundColor || "#ffffffff"}
                      onChange={(e) =>
                        onSettingsChange({
                          ...customSettings,
                          backgroundColor: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Bold Feed Title */}
                  <div className={styles.toggleGroup}>
                    <label className={styles.toggleLabel}>
                      <span className={styles.toggleText}>Bold Feed Title</span>
                      <div className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={!!customSettings.feedTitleBold}
                          onChange={(e) =>
                            onSettingsChange({
                              ...customSettings,
                              feedTitleBold: e.target.checked,
                            })
                          }
                          className={styles.switchInput}
                        />
                        <span className={styles.slider}></span>
                      </div>
                    </label>
                  </div>
                </>
              )}

              {/* Show Feed Description */}
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Show Description</span>
                  <div className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={!!customSettings.showFeedDescription}
                      onChange={(e) =>
                        onSettingsChange({
                          ...customSettings,
                          showFeedDescription: e.target.checked,
                        })
                      }
                      className={styles.switchInput}
                    />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>

              {customSettings.showFeedDescription && (
                <div className={styles.toggleGroup}>
                  <label className={styles.toggleLabel}>
                    <span className={styles.toggleText}>Bold Description</span>
                    <div className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={!!customSettings.feedDescriptionBold}
                        onChange={(e) =>
                          onSettingsChange({
                            ...customSettings,
                            feedDescriptionBold: e.target.checked,
                          })
                        }
                        className={styles.switchInput}
                      />
                      <span className={styles.slider}></span>
                    </div>
                  </label>
                </div>
              )}

              {/* Show Feed Date */}
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Show Date</span>
                  <div className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={!!customSettings.showFeedDate}
                      onChange={(e) =>
                        onSettingsChange({
                          ...customSettings,
                          showFeedDate: e.target.checked,
                        })
                      }
                      className={styles.switchInput}
                    />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WidgetCustomizer;
