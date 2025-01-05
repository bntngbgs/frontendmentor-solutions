const showProjectBtn = document.querySelector('.back-button');
const bookmarkBtn = document.querySelector('.bookmark');
const bookmarkSvg = bookmarkBtn.children[0].children[0].children[0];
const rewardBtn = document.querySelectorAll('.reward-button');
const mobileNavBtn = document.querySelector('.hamburger-icon');
const mobileCloseBtn = document.querySelector('.close-icon');
const navBar = document.querySelector('.nav');
let isBookmarked = false;

mobileNavBtn.addEventListener('click', () => {
  mobileNavBtn.classList.add('hidden');
  mobileCloseBtn.classList.remove('hidden');

  navBar.style.display = 'flex';
});

mobileCloseBtn.addEventListener('click', () => {
  mobileNavBtn.classList.remove('hidden');
  mobileCloseBtn.classList.add('hidden');

  navBar.style.display = 'none';
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 375) {
    navBar.style.display = 'flex';
    mobileCloseBtn.classList.add('hidden');
    mobileNavBtn.classList.add('hidden');
  } else if (window.innerWidth <= 375) {
    if (mobileCloseBtn.classList.contains('hidden')) {
      mobileNavBtn.classList.remove('hidden');
      navBar.style.display = 'none';
    } else {
      mobileNavBtn.classList.add('hidden');
    }
  }
});

// if (window.innerWidth <= 375) {
//   navBar.style.display = 'none';
//   mobileNavBtn.classList.remove('hidden');
//   mobileCloseBtn.classList.add('hidden');
// }
// });

// bookmarkBtn.addEventListener('mouseover', (e) => {
//   if (bookmarkSvg.getAttribute('fill') === '#147b74') {
//     return;
//   } else {
//     bookmarkSvg.setAttribute('fill', '#696969');
//   }
// });

// bookmarkBtn.addEventListener('mouseleave', (e) => {
//   if (bookmarkSvg.getAttribute('fill') === '#147b74') {
//     return;
//   } else {
//     bookmarkSvg.setAttribute('fill', '#2f2f2f');
//   }
// });

for (let i = 0; i < rewardBtn.length; i++) {
  rewardBtn[i].addEventListener('click', (e) => {
    let isFromRewardBtn = true;
    let checkedElement = e.target.parentElement.classList[1];
    createModalElement(isFromRewardBtn, checkedElement);
  });
}

bookmarkBtn.addEventListener('click', (e) => {
  if (!isBookmarked) {
    bookmarkBtn.classList.add('bookmarked');
    bookmarkBtn.children[1].innerHTML = 'Bookmarked';
    bookmarkBtn.children[1].classList.add('green-text');
    bookmarkBtn.children[0].children[0].children[1].setAttribute(
      'fill',
      '#dddddd'
    );
    bookmarkSvg.setAttribute('fill', '#147b74');
    // bookmarkBtn.style.backgroundColor = '#e8e8e8';
    isBookmarked = true;
  } else {
    bookmarkBtn.classList.remove('bookmarked');
    bookmarkBtn.children[1].innerHTML = 'Bookmark';
    bookmarkBtn.children[1].classList.remove('green-text');
    bookmarkBtn.children[0].children[0].children[1].setAttribute(
      'fill',
      '#b1b1b1'
    );
    bookmarkSvg.setAttribute('fill', '#2f2f2f');
    bookmarkBtn.removeAttribute('style');
    isBookmarked = false;
  }
});

showProjectBtn.addEventListener('click', () => {
  let isFromRewardBtn = false;
  let checkedElement = null;
  createModalElement(isFromRewardBtn, checkedElement);
});

function createModalElement(isFromRewardBtn, checkedElement) {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.classList.remove('hidden');

  const modalContentContainer = document.createElement('div');
  modalContentContainer.classList.add('modal-content');

  modalContentContainer.addEventListener('click', (e) => {
    if (!e.target.value || e.target.hasAttribute('inputmode')) {
      return;
    }

    if (!e.target.classList.contains('checkmark')) {
      if (!document.querySelector('.green-border')) {
        e.target.parentElement.parentElement.parentElement.classList.add(
          'green-border'
        );
      } else {
        document
          .querySelector('.green-border')
          .classList.remove('green-border');
        e.target.parentElement.parentElement.parentElement.classList.add(
          'green-border'
        );
      }
    }
  });

  const projectHeading = document.createElement('h2');
  projectHeading.innerText = 'Back this project';

  const projectParagraph = document.createElement('p');
  projectParagraph.innerText =
    'Want to support us in bringing Mastercraft Bamboo Monitor Riser out in the world?';

  const closeModalBtn = document.createElement('img');
  closeModalBtn.setAttribute('src', './images/icon-close-modal.svg');
  closeModalBtn.classList.add('close-modal');

  closeModalBtn.addEventListener('click', () => {
    modalContainer.classList.add('hidden');
    modalContentContainer.remove();
    // modalContainer.innerHTML = '';
  });

  modalContentContainer.append(projectHeading, projectParagraph, closeModalBtn);

  getProjectData((data) => {
    for (let i = 0; i < data.length + 1; i++) {
      if (i == 0) {
        const title = 'Pledge with no reward';
        const desc =
          'Choose to support us without reward if you simply believe in our project. As a backer, you will be signed up to receive product updates via email.';
        const el = createModalContent(title, desc);
        modalContentContainer.append(el);
      }
      const jsonData = data[i];
      const {
        'project-title': title,
        description: desc,
        qty,
        pledge,
      } = jsonData;
      const el = createModalContent(
        title,
        desc,
        pledge,
        qty,
        isFromRewardBtn,
        checkedElement
      );

      modalContentContainer.append(el);
    }
  });

  modalContainer.append(modalContentContainer);
}

function getProjectData(callback) {
  const request = new XMLHttpRequest();

  request.open('GET', 'project-data.json');

  request.addEventListener('readystatechange', () => {
    if (request.readyState == 4 && request.status === 200) {
      const data = JSON.parse(request.responseText);
      callback(data);
    }
  });

  request.send();
}

function createModalContent(
  title,
  desc,
  pledge,
  quantity,
  isFromRewardBtn,
  checkedElement
) {
  const projectItemContainer = document.createElement('div');
  projectItemContainer.classList.add('project-item-container');

  const projectItem = document.createElement('div');
  projectItem.classList.add('project-item');

  const radioContainer = document.createElement('label');
  radioContainer.classList.add('radio-container');

  const radioInput = document.createElement('input');
  const spanForCheck = document.createElement('span');
  spanForCheck.classList.add('checkmark');
  let radioValue = title.split(' ').join('-').toLowerCase();
  radioInput.setAttribute('type', 'radio');
  radioInput.setAttribute('value', radioValue);
  radioInput.setAttribute('id', radioValue);
  radioInput.setAttribute('name', 'project-radio');

  radioContainer.append(radioInput, spanForCheck);

  radioInput.addEventListener('change', (e) => {
    if (!e.target.classList.contains('checkmark')) {
      if (e.target.checked && !document.querySelector('.pledge-details')) {
        e.target.parentElement.parentElement.nextElementSibling.classList.remove(
          'hidden'
        );
        e.target.parentElement.parentElement.nextElementSibling.classList.add(
          'pledge-details'
        );
      } else {
        document.querySelector('.pledge-details').classList.add('hidden');
        document
          .querySelector('.pledge-details')
          .classList.remove('pledge-details');
        e.target.parentElement.parentElement.nextElementSibling.classList.remove(
          'hidden'
        );
        e.target.parentElement.parentElement.nextElementSibling.classList.add(
          'pledge-details'
        );
      }
    }
  });

  if (isFromRewardBtn && checkedElement === radioValue) {
    // console.log(radioInput);
    radioInput.checked = true;
    projectItemContainer.classList.add('green-border');
    // console.log(document.querySelectorAll(`input[id="pledge"]`));
    // e.target.parentElement.parentElement.nextElementSibling.classList.remove(
    //   'hidden'
    // );
    // e.target.parentElement.parentElement.nextElementSibling.classList.add(
    //   'pledge-details'
    // );
  }

  const projectDescContainer = document.createElement('div');
  projectDescContainer.classList.add('project-desc-container');

  const projectDescChild1 = document.createElement('div');
  projectDescChild1.classList.add('top-section');

  const projectDescChild2 = document.createElement('div');
  projectDescChild2.classList.add('bot-section');

  const projectTitle = document.createElement('label');
  projectTitle.classList.add('project-item-title');
  projectTitle.setAttribute('for', radioValue);
  projectTitle.innerHTML = title;

  const pledgeDesc = document.createElement('p');
  pledgeDesc.classList.add('pledge');
  pledge
    ? (pledgeDesc.innerHTML = `Pledge $${pledge} or more`)
    : (pledgeDesc.innerHTMl = '');

  const qtyDesc = document.createElement('p');
  quantity !== undefined
    ? (qtyDesc.innerHTML = `<span class="bold">${quantity}</span> left`)
    : (qtyDesc.innerHTML = '');

  const projectDesc = document.createElement('p');
  projectDesc.innerHTML = desc;

  projectDescChild2.append(projectDesc);
  projectDescChild1.append(projectTitle, pledgeDesc, qtyDesc);

  projectDescContainer.append(projectDescChild1, projectDescChild2);

  projectItem.append(radioContainer, projectDescContainer);

  if (quantity == 0) {
    projectItem.classList.add('lower-opacity');
    radioInput.disabled = true;
  }

  if (!pledge && !quantity) {
    const pledgeData = createPledgeDetails(pledge, true, radioInput);
    projectItemContainer.append(projectItem, pledgeData);
  } else {
    const pledgeData = createPledgeDetails(pledge, false, radioInput);
    projectItemContainer.append(projectItem, pledgeData);
  }

  return projectItemContainer;
}

function createPledgeDetails(pledge, isNoReward, radioInput) {
  const pledgeDetails = document.createElement('div');

  const pledgeButton = document.createElement('button');
  pledgeButton.classList.add('btn', 'back-button');
  pledgeButton.innerText = 'Continue';

  pledgeButton.addEventListener('click', () => {
    const completedReward = createCompletedModal();
    document.querySelector('.modal-content').remove();
    document.querySelector('.modal-container').append(completedReward);
  });

  if (!isNoReward) {
    const pledgeInstructions = document.createElement('p');
    pledgeInstructions.innerText = 'Enter your pledge';

    const inputCurrency = document.createElement('span');
    inputCurrency.classList.add('currency');
    inputCurrency.innerText = '$';

    const pledgeInput = document.createElement('input');
    pledgeInput.setAttribute('type', 'text');
    pledgeInput.setAttribute('inputmode', 'numeric');
    pledgeInput.value = pledge;

    pledgeDetails.append(
      pledgeInstructions,
      inputCurrency,
      pledgeInput,
      pledgeButton
    );
  } else {
    pledgeButton.classList.add('right-align');
    pledgeDetails.append(pledgeButton);
  }

  if (radioInput.checked == false) {
    pledgeDetails.classList.add('hidden');
  } else {
    pledgeDetails.classList.add('pledge-details');
  }

  return pledgeDetails;
}

function createCompletedModal() {
  const completedModalContainer = document.createElement('div');
  completedModalContainer.classList.add('modal-complete');

  const checkImage = document.createElement('img');
  checkImage.src = './images/icon-check.svg';
  const thanksText = document.createElement('h3');
  thanksText.innerHTML = 'Thanks for your support!';

  const thanksParagraph = document.createElement('p');
  thanksParagraph.innerHTML =
    'Your pledge bring us one step closer to sharing Mastercraft Bamboo Monitor Riser worlwide. You will ger an email once our campaign is completed.';

  const thanksBtn = document.createElement('button');
  thanksBtn.innerText = 'Got it!';
  thanksBtn.classList.add('back-button');

  thanksBtn.addEventListener('click', () => {
    document.querySelector('.modal-complete').remove();
    document.querySelector('.modal-container').classList.add('hidden');
  });

  completedModalContainer.append(
    checkImage,
    thanksText,
    thanksParagraph,
    thanksBtn
  );

  return completedModalContainer;
}
