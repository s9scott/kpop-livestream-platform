/**
 * @file PrivateChatList.js
 * @author Simon Tenedero
 * @created 2025-05-26
 * @lastModified 2025-05-27
 * @desc file containing PrivateChatList component
 */

import TreasureLogo from '../../assets/Treasure_logo_2023.png'; //placeholder image, need to update to be customizable
import { leavePrivateChat, fetchChats } from '../../utils/privateChatUtils';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

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

  // Definimos las clases como constantes para no repetir tanto
  const hoverClass = "hover:bg-primary";

  return (
        <div className={`${chats.length>0?'px-2 w-full':''}`}>

        {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center mb-3 w-full"
                onClick={() => {onSelectChat(chat.id)}}
              >

                <img className="w-11 h-11 mr-4 border-white rounded-full" src={TreasureLogo} alt={chat.id + " logo"} />
                <div className="flex flex-wrap items-center p-2 cursor-pointer text-sm flex-grow">
                    <p className="font-bold cursor-pointer max-w-[150px] min-w-0 whitespace-nowrap overflow-hidden text-ellipsis block text-md">
                      {chat.name || chat.url}
                    </p>

                    <Menu as="div" className="ml-auto relative inline-block text-left">
                      {({open}) => (
                        <div onClick={(e) => e.stopPropagation()}>
                        <MenuButton 
                        className={`relative w-8 h-8 font-bold ${open?'bg-base-100 rounded-full':''}`}
                        >
                          ⋮
                        </MenuButton>

                        {open && (
                          <MenuItems className="absolute top-full right-6 mt-1 w-20 bg-base-100 rounded-full">
                            <MenuItem
                            className={`right-3 w-content bg-base-100 text-white rounded-full hover:bg-primary text-sm`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); //stop event bubbling - which would trigger parent onClick
                                  leaveChat(user,chat.id);
                                }}
                                className="whitespace-nowrap px-5 py-1"
                              >
                                leave chat
                              </button>
                            </MenuItem>
                          </MenuItems>
                        )}
                        </div>)
                      }
                    </Menu>
                    <p className="w-full whitespace-nowrap text-ellipsis text-sm">userA: this is placeholder text</p>
                </div>
                
              </div>
            ))
          ) : (

          <div className="flex flex-col items-center justify-center h-full text-center p-4 mt-[30%]">
              <div className="text-4xl mb-2">🤝</div>
              <div className="text-sm text-gray-400 mb-1">No current chats</div>
              <div className="text-xs text-gray-500">Why not invite some friends?</div>
          </div>

        )}
      </div>
  );
};

export default PrivateChatList;
