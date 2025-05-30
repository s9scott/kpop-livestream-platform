/**
 * @file PrivateChatList.js
 * @author Simon Tenedero
 * @created 2025-05-26
 * @lastModified 2025-05-27
 * @desc file containing PrivateChatList component
 */

import TreasureLogo from '../../assets/Treasure_logo_2023.png'; //placeholder image, need to update to be customizable

/**
 * This component displays a list of the users' privateChats - it is the 'messages' pane displayed when selected from the private tabs
 * Each tab has an image for the chat, the title, and a recently sent message (deciding if we will include the name of the livestreams)
 * 
 * @param {object} chats - array containing chat objects (have fields such as id, title, etc.)
 * @param {Function} onSelectChat - function that handles opening the chat when clicking the corresponding tab
 * @param {Function} onCloseChat - (NOTE: STILL NEED TO IMPLEMENT) function that handles leaving chats 
 * 
 * @returns {JSX.Element} PrivateChatList 
 */
const PrivateChatList = ({ 
  chats, 
  onSelectChat, 
  onCloseChat}) => {

  return (
        <>

        {chats.length > 0 ? (

          chats.map((chat) => (
            <div
              key={chat.id}
              className="w-full flex items-center px-4 mb-3"
              onClick={() => {onSelectChat(chat.id)}}
            >

              <img className="w-11 h-11 mr-3 border-white rounded-full" src={TreasureLogo} alt={chat.id + " logo"} />
              <div className="flex flex-wrap items-center justify-between p-2 cursor-pointer flex-1 text-sm">
                <span className="flex-grow truncate font-bold">
                  {chat.name || chat.url}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseChat(chat.id);
                  }}
                  className="ml-2 text-base w-5 h-6"
                >
                  ⋮
                </button>
                <span className="flex-grow truncate w-full">userA: this is placeholder text</span>
              </div>
              
            </div>))

          ) : (

          <div className="flex items-center justify-between p-2 flex-1 text-sm bg-base-200 text-base-content">
            <span className="flex-grow truncate">No private chats open</span>
          </div>

        )}
      </>
  );
};

export default PrivateChatList;
