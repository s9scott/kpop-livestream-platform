/**
 * @file PrivateChatList.js
 * @author Simon Tenedero
 * @created 2025-05-26
 * @lastModified 2025-05-27
 * @desc file containing PrivateChatList component
 */

import TreasureLogo from '../../assets/Treasure_logo_2023.png'; //placeholder image, need to update to be customizable
import { leavePrivateChat, fetchChats } from '../../utils/privateChatUtils';

/**
 * This component displays a list of the users' privateChats - it is the 'messages' pane displayed when selected from the private tabs
 * Each tab has an image for the chat, the title, and a recently sent message (deciding if we will include the name of the livestreams)
 * 
 * @param {Object} user - current user
 * @param {Object} chats - array containing chat objects (have fields such as id, title, etc.)
 * @param {Function} setPrivateChats - setState function for chats
 * 
 * @param {Function} onSelectChat - function that handles opening the chat when clicking the corresponding tab
 * 
 * @returns {JSX.Element} PrivateChatList 
 */
const PrivateChatList = ({ 
  user,
  chats,
  setPrivateChats,
  onSelectChat}) => {

  const leaveChat = async (user,chatId) => {
    await leavePrivateChat(user,chatId);
    await fetchChats(user,setPrivateChats);
  }

  return (
        <div className={`${chats.length>0?'px-2 w-full':''}`}>

        {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center mb-3"
                onClick={() => {onSelectChat(chat.id)}}
              >

                <img className="w-11 h-11 mr-2 border-white rounded-full" src={TreasureLogo} alt={chat.id + " logo"} />
                <div className="flex flex-wrap items-center justify-between p-2 cursor-pointer flex-1 text-sm">
                    <span className="truncate font-bold mr-auto">
                      {chat.name || chat.url}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        leaveChat(user,chat.id);
                      }}
                      className="ml-2 text-base w-5 h-6"
                    >
                      ⋮
                    </button>
                  <p className="w-full whitespace-nowrap text-ellipsis">userA: this is placeholder text</p>
                </div>
                
              </div>
            ))
          ) : (

          <div className="flex flex-col items-center justify-center h-full text-center p-4 mt-[40%]">
              <div className="text-4xl mb-2">🤝</div>
              <div className="text-sm text-gray-400 mb-1">No current chats</div>
              <div className="text-xs text-gray-500">Why not invite some friends?</div>
          </div>

        )}
      </div>
  );
};

export default PrivateChatList;
